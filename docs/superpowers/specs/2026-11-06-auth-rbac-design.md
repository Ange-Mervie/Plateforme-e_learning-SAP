# Design : socle d’authentification et de permissions

Date : 2026-11-06

## Contexte

L’application utilise Next.js App Router, MySQL via `mysql2` et des migrations SQL. Le schéma Prisma n’est pas utilisé par les routes actuelles. L’authentification du navigateur est simulée par `localStorage`, le middleware accepte un cookie indicateur non signé, et plusieurs API font confiance à un `userId` fourni par le client. Les routes de login et d’inscription existantes n’établissent pas de session serveur.

La suite demandée comprend plusieurs domaines indépendants et dépendants. Elle sera livrée par phases, avec des tests pour chaque phase :

1. Identité serveur, sessions et permissions par rôle.
2. Abonnements et paiements réels, activés exclusivement après confirmation vérifiée du prestataire.
3. Progression persistante, évaluations interactives et projets/soutenances.
4. Attestations générées et téléchargées via des accès contrôlés.
5. Section IBN Group détaillée et vérifications transversales.

Cette spécification couvre la première phase uniquement. Les phases suivantes auront leurs propres décisions de conception, notamment le choix du prestataire de paiement et du stockage des fichiers.

## Objectifs

- Remplacer l’authentification simulée par un flux persistant d’inscription, connexion, consultation de session et déconnexion.
- Déterminer l’identité et le rôle exclusivement à partir d’une session vérifiée côté serveur.
- Protéger les pages et toutes les API concernées par des vérifications serveur réutilisables.
- Empêcher un utilisateur de lire ou modifier les données d’un autre en forgeant un identifiant client.
- Poser une base de tests automatisés couvrant l’authentification et les permissions.

## Architecture retenue

- Conserver MySQL et les accès SQL actuels avec `mysql2`; ne pas introduire de changement d’ORM.
- Ajouter une migration SQL versionnée pour les sessions et le nom de profil, et harmoniser le rôle historique `learner` avec `apprenant`.
- Créer des sessions opaques aléatoires. Seul leur hash est conservé en base ; le secret de session est transmis dans un cookie `HttpOnly`, `SameSite=Lax`, `Path=/`, avec une durée de sept jours et l’attribut `Secure` en production.
- À chaque requête protégée, retrouver une session non expirée et charger le compte et son rôle actuels depuis MySQL. Ne pas prendre le rôle depuis une donnée contrôlée par le navigateur.
- Centraliser les fonctions serveur de lecture de session et d’autorisation de rôle. Les pages peuvent rediriger les visiteurs non authentifiés pour l’UX ; chaque route API doit aussi appliquer sa propre autorisation.
- Employer les rôles existants de l’interface : `apprenant`, `formateur`, `consultant`, `expert` et `admin`. Une inscription publique crée toujours un `apprenant`. L’attribution des rôles privilégiés est réservée à une action serveur protégée par le rôle `admin`.
- Conserver des réponses d’authentification minimales : ne jamais retourner le secret de session, le hash de mot de passe ou des données internes du compte.

## Flux

1. **Inscription** : valider et normaliser nom, email et mot de passe ; hacher le mot de passe avec bcrypt ; créer le compte au rôle `apprenant`. Refuser proprement un email déjà utilisé.
2. **Connexion** : vérifier les identifiants avec un message d’échec générique ; créer une session persistée ; définir le cookie sécurisé. Ne jamais utiliser un secret de développement si la configuration serveur est absente.
3. **Session courante** : lire le cookie côté serveur, valider la session et retourner un profil public minimal.
4. **Déconnexion** : révoquer la session en base, supprimer le cookie et renvoyer un résultat explicite.
5. **Page/API protégée** : résoudre l’identité via la session ; renvoyer `401` si elle est absente ou invalide, `403` si le rôle est insuffisant. Les opérations sur les données personnelles utilisent l’identifiant du compte connecté et ignorent tout `userId` fourni par le client.
6. **Mutation avec cookie** : refuser les requêtes cross-origin selon l’origine attendue, en complément des attributs SameSite.

Les formulaires de connexion et d’inscription appellent les routes serveur. Le contexte client obtient son état depuis la route de session et ne conserve pas d’identité d’autorisation dans `localStorage`. Les routes existantes de progression, évaluations, projets, certificats et abonnements cessent de recevoir l’identité du propriétaire depuis le corps ou la query string ; elles vérifient la session et l’ownership côté serveur. Les règles d’accès aux contenus payants et l’activation d’abonnement restent dans la phase 2.

## Erreurs et sécurité

- Valider les corps JSON, les formats, les longueurs et les valeurs de rôle côté serveur ; répondre avec des statuts HTTP cohérents.
- Utiliser un échec générique pour des identifiants invalides, sans révéler si l’email existe.
- Refuser l’accès en cas de panne de base ou de configuration requise ; ne pas transformer une erreur en session valide.
- Ne jamais faire confiance au middleware comme unique barrière d’autorisation.
- Ne jamais accepter un rôle depuis l’inscription publique ou un paramètre client.
- Limiter les informations de profil renvoyées à ce qui est nécessaire à l’interface.

## Tests et critères d’acceptation

Les tests automatisés ciblés doivent couvrir :

- création d’un compte au rôle apprenant, hachage du mot de passe et email dupliqué ;
- connexion valide et invalide, cookie HttpOnly et absence de jeton dans le JSON ;
- session valide, expirée, absente et révoquée après déconnexion ;
- redirection ou refus d’un accès non authentifié ;
- refus `403` pour un rôle insuffisant et impossibilité d’auto-attribution d’un rôle privilégié ;
- isolation de données entre deux apprenants même si une requête falsifie un identifiant ;
- refus d’une mutation cross-origin et comportement explicite en cas d’erreur de base/configuration.

La phase est terminée lorsque les parcours de connexion et d’inscription fonctionnent avec MySQL, aucun contrôle d’accès ne dépend de `localStorage` ou d’un `userId` client, les routes protégées valident les sessions et rôles côté serveur, la migration est reproductible et les tests ciblés passent.

## Hors périmètre de cette phase

- Paiement réel, abonnements actifs, reçus et webhooks de prestataire.
- Gating par abonnement des contenus de formation.
- Sauvegarde de progression, moteur de quiz, remise et notation de projets.
- Génération, stockage ou téléchargement de certificats.
- Refonte détaillée de la page IBN Group.
- Interface d’administration complète. La phase 1 prévoit le contrôle serveur des rôles et une voie admin protégée pour l’attribution des rôles, pas une console graphique.

## Points à confirmer pour les phases suivantes

- Prestataire(s), mode de test et devise réellement disponibles pour les cartes et Mobile Money.
- Politique de facturation, durée et renouvellement des abonnements.
- Fournisseur de stockage des fichiers de projets et attestations.
- Critères d’éligibilité et données affichées sur les attestations.
