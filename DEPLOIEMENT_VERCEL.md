# Déploiement sur Vercel (gratuit, sécurisé)

## Prérequis
1. Compte [Vercel](https://vercel.com) (gratuit)
2. Base de données PostgreSQL serverless gratuite (choisir UN des services ci-dessous)
3. Repository GitHub/GitLab/Bitbucket

## 1. Créer la base de données (gratuite, au choix)
### Option A — Vercel Postgres (le plus simple, intégré à Vercel)
1. Sur Vercel : **Storage → Create Database → Postgres**
2. Nommez-la `sap-academy` → Vercel crée la DB et injecte automatiquement `DATABASE_URL`
3. Aucun compte séparé requis.

### Option B — Supabase (gratuit, 500 Mo, interface simple)
1. Allez sur https://supabase.com et créez un compte (GitHub suffit)
2. **New Project** → nommez-le `sap-academy` → choisissez une région proche
3. **Settings → Database → Connection string → URI** → copiez-la (format `postgresql://postgres:...@db.xxx.supabase.co:5432/postgres`)
4. Ajoutez `?sslmode=require` à la fin si absent.

### Option C — Neon (gratuit, 0.5 Go)
1. Allez sur https://neon.tech → créez un projet `sap-academy`
2. Copiez la **Connection String** (`postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`)

> Note : le stockage JSON local (`data/*.json`) ne persiste PAS sur Vercel (système de fichiers éphémère). Une base PostgreSQL est obligatoire en production.

## 2. Importer le projet sur Vercel
1. Poussez ce code sur GitHub
2. Sur Vercel : **Add New Project** → Import Git Repository
3. Sélectionnez votre repo
4. **Framework Preset** : Next.js (détecté automatiquement)

## 3. Variables d'environnement sur Vercel
Dans **Settings → Environment Variables**, ajoutez :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `DATABASE_URL` | `postgresql://...` (de Neon) | Production, Preview, Development |
| `SESSION_SECRET` | Générez une clé 32+ chars | Production, Preview, Development |
| `APP_ORIGIN` | `https://votre-projet.vercel.app` | Production, Preview |
| `API_WRITE_TOKEN` | (optionnel) Clé aléatoire | Production, Preview, Development |
| `GMAIL_CLIENT_ID` | (optionnel) | Production, Preview |
| `GMAIL_CLIENT_SECRET` | (optionnel) | Production, Preview |
| `GMAIL_REDIRECT_URI` | `https://votre-projet.vercel.app/api/gmail/callback` | Production, Preview |

**Générer SESSION_SECRET :**
```bash
openssl rand -base64 32
```

## 4. Déployer
- Cliquez **Deploy** — Vercel lance `prisma generate && prisma db push && next build` (crée les tables automatiquement)

## 5. Après le déploiement
1. Allez sur votre URL Vercel
2. Créez un compte admin via `/inscription`
3. En base, mettez le rôle `admin` :
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'votre@email.com';
```

## Sécurité incluse
- Headers CSP, HSTS, X-Frame-Options, etc. (`src/proxy.ts`)
- Rate limiting API (100 req/min/IP)
- Cookies sécurisés (SameSite=Strict, HttpOnly, Secure en prod)
- CSRF protection sur les mutations
- Prisma (prévention injection SQL)
- Bcrypt pour les mots de passe

## Commandes utiles
```bash
# Développement local (nécessite PostgreSQL local ou tunnel Neon)
npm run dev

# Générer Prisma Client
npx prisma generate

# Migration DB locale
npx prisma migrate dev

# Studio Prisma (interface DB)
npx prisma studio

# Build production
npm run build
```

## Structure des données (Prisma)
- `User` : comptes (apprenant, formateur, admin, etc.)
- `Session` : sessions authentification (7 jours)
- `Progress` : progression cours/leçons
- `Assessment` : résultats évaluations
- `Certificate` : attestations
- `ContactRequest` : demandes de formation
- `CourseDocument` : documents de cours
- `IBNGroupContent` : contenus page IBN Group
- `Subscription` : abonnements
- `Project` / `Defense` : projets et soutenances

## Dépannage
- **Erreur Prisma** : vérifiez `DATABASE_URL` et que la base est accessible
- **Build failed** : `npx prisma generate` doit passer avant `next build`
- **Auth ne marche pas** : `SESSION_SECRET` doit être identique partout
- **CORS** : `APP_ORIGIN` doit correspondre à votre domaine Vercel