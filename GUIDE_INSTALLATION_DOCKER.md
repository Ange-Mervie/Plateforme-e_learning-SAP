# Guide d''installation Docker (Windows 11) - Plateforme ELEVATE By IBN

Ce guide explique comment deployer la plateforme SAP E-learning IBN Group sur une machine **Windows 11** avec **Docker Desktop**.

> Important : ne modifiez pas le code applicatif pour le deploiement. Les donnees existantes (base MySQL, dossiers persistants `data/`) sont conservees via des volumes Docker. Ne placez jamais de mots de passe reels dans Git.

## 1. Installer Docker Desktop sur Windows 11

1. Verifiez la configuration minimale : Windows 11 64 bits, virtualisation activee dans le BIOS/UEFI, 8 Go de RAM recommandes.
2. Telechargez **Docker Desktop for Windows** depuis le site officiel Docker : https://www.docker.com/products/docker-desktop/
3. Lancez l''installateur `Docker Desktop Installer.exe`.
4. Lors de l''installation, laissez activee l''option **Use WSL 2 instead of Hyper-V** (recommandee).
5. Redemarrez l''ordinateur si demande.
6. Ouvrez **Docker Desktop** et attendez que le moteur indique **Engine running**.
7. Ouvrez **PowerShell** et verifiez l''installation :

```powershell
docker --version
docker compose version
```

Les deux commandes doivent afficher une version.

## 2. Ouvrir le dossier du projet

1. Copiez/telechargez le dossier complet du projet sur la machine (ex. `C:\IBN\Plateforme_e-learning-SAP`).
2. Ouvrez **PowerShell**.
3. Placez-vous dans le dossier du projet :

```powershell
cd "C:\IBN\Plateforme_e-learning-SAP"
```

(Remplacez le chemin par l''emplacement reel du dossier.)

## 3. Configurer les variables d''environnement

1. Dans le dossier du projet, copiez le modele `.env.example` en `.env` :

```powershell
Copy-Item .env.example .env
```

2. Ouvrez `.env` avec le Bloc-notes :

```powershell
notepad .env
```

3. Renseignez des valeurs **securisees** (sans espaces, mots de passe forts) :
   - `MYSQL_PASSWORD` : mot de passe de l''utilisateur applicatif MySQL.
   - `MYSQL_ROOT_PASSWORD` : mot de passe administrateur MySQL (different).
   - `DATABASE_URL` : doit contenir **le meme mot de passe** que `MYSQL_PASSWORD` et le meme utilisateur/base. Format :
     `mysql://sap_user:VOTRE_MOT_DE_PASSE@db:3306/sap_academy`
   - `APP_ORIGIN` : URL d''acces a la plateforme (ex. `http://localhost:3000` ou `http://ADRESSE_SERVEUR:3000`).

4. Enregistrez le fichier. **Ne partagez pas `.env` et ne le commitez pas dans Git.**

> La base utilisee est **MySQL** (fournisseur reel du projet/Prisma et scripts SQL `sql/001_...` a `sql/007_...`). Les migrations SQL sont appliquees automatiquement au demarrage du conteneur applicatif, apres verification de la disponibilite de la base.

## 4. Demarrer la plateforme

Depuis le dossier du projet dans PowerShell :

```powershell
docker compose up -d --build
```

- La premiere execution peut prendre plusieurs minutes (telechargement des images, construction, installation des dependances).
- Le service `db` (MySQL 8.4) demarre avec un volume persistant `mysql_data`.
- Le service `app` attend que la base soit disponible, applique les migrations SQL en attente, puis demarre Next.js sur le port **3000**.
- Le dossier local `./data` est monte dans le conteneur pour conserver les donnees fichiers de l''application (demandes, sessions/fichiers JSON existants). Ne supprimez pas ce dossier.

Verifiez l''etat des conteneurs :

```powershell
docker compose ps
```

## 5. Acceder a la plateforme depuis le navigateur

Ouvrez un navigateur sur la machine et allez a :

- http://localhost:3000

Si vous accedez depuis un autre poste du reseau, utilisez l''adresse IP ou le nom de la machine Windows 11 :

- http://ADRESSE_IP_OU_NOM_DU_SERVEUR:3000

Assurez-vous que le pare-feu Windows autorise les connexions entrantes sur le port **3000** si l''acces reseau est necessaire, et que `APP_ORIGIN` correspond a l''URL utilisee.

## 6. Arreter et redemarrer les conteneurs

**Arreter** (les donnees restent conservees dans les volumes/dossiers montes) :

```powershell
docker compose stop
```

**Redemarrer** :

```powershell
docker compose start
```

**Arreter et supprimer les conteneurs** (sans supprimer les volumes de donnees MySQL ni le dossier `./data`) :

```powershell
docker compose down
```

**Redemarrer completement (reconstruction si necessaire)** :

```powershell
docker compose up -d --build
```

> N''utilisez pas `docker compose down -v` sauf si vous souhaitez volontairement supprimer le volume de base de donnees (perte des donnees MySQL).

## 7. Sauvegarder et restaurer la base de donnees

Les exemples ci-dessous utilisent les valeurs de votre `.env` (`MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_ROOT_PASSWORD`). Executez-les depuis le dossier du projet.

### Sauvegarde (dump SQL)

Creer un dossier de sauvegarde puis exporter la base :

```powershell
New-Item -ItemType Directory -Force -Path .\backups | Out-Null
docker compose exec -T db sh -c "mysqldump -uroot -p\"$MYSQL_ROOT_PASSWORD\" --single-transaction --routines --triggers \"$MYSQL_DATABASE\"" > .\backups\sap_academy_backup.sql
```

Conservez aussi une copie du dossier `.\data` (demandes/fichiers applicatifs persistants).

### Restauration

1. Assurez-vous que les conteneurs tournent (`docker compose up -d`).
2. Restaurez le dump dans la base :

```powershell
Get-Content .\backups\sap_academy_backup.sql | docker compose exec -T db sh -c "mysql -uroot -p\"$MYSQL_ROOT_PASSWORD\" \"$MYSQL_DATABASE\""
```

3. Restaurez le dossier `.\data` depuis votre sauvegarde si necessaire, puis redemarrez l''application :

```powershell
docker compose restart app
```

## 8. Consulter les journaux en cas d''erreur

Voir les journaux de tous les services :

```powershell
docker compose logs
```

Suivre les journaux en temps reel :

```powershell
docker compose logs -f
```

Journaux d''un service specifique :

```powershell
docker compose logs app
docker compose logs db
docker compose logs -f app
```

Verifier l''etat et la sante :

```powershell
docker compose ps
```

Si l''application ne demarre pas, consultez d''abord `docker compose logs app` (attente base de donnees, migrations SQL, erreurs `DATABASE_URL`) et `docker compose logs db` (initialisation MySQL/mot de passe).

## Commandes utiles (resume)

```powershell
# Demarrer
docker compose up -d --build

# Etat
docker compose ps

# Journaux
docker compose logs -f

# Arreter
docker compose stop

# Redemarrer
docker compose start

# Arreter les conteneurs (conserve les donnees)
docker compose down
```
