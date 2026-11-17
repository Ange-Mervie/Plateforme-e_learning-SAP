# SAP Learning Academy

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database setup

The application uses MySQL via `mysql2`. Configure `DATABASE_URL` in the local `.env` file. Never commit or share the connection URL.

Apply the SQL migrations once, in this order, to the database selected by `DATABASE_URL`:

1. `sql/001_init.sql`
2. `sql/002_features.sql`
3. `sql/003_auth_sessions.sql`
4. `sql/004_local_store_import.sql`

In production, also configure `APP_ORIGIN` to the canonical HTTPS origin of the application. Do not use a development fallback for database credentials, session secrets, or origins.

### Import existing local data

If `src/data/local-database.json` exists, keep it as a backup and run `npm run db:import-local` from an interactive terminal after applying the migrations. The importer is transactional and idempotent for the same file contents. It does not overwrite existing accounts, and it asks for new masked passwords for any seeded `demo123` or `admin123` credentials. A changed snapshot after import requires manual reconciliation; the source file is never deleted or edited by the importer.

MySQL is the application's only persistent source of truth. If the database is unavailable, authenticated operations fail explicitly instead of switching to temporary in-memory or browser-owned records.

## Docker (déploiement local)

1. Copier le fichier d'exemple et remplir les valeurs réelles :

   ```bash
   cp .env.example .env
   # puis éditer .env : MYSQL_PASSWORD, MYSQL_ROOT_PASSWORD, SESSION_SECRET, APP_PORT, APP_ORIGIN
   ```

   `.env` n'est jamais commité (voir `.gitignore`). Ne jamais réutiliser les valeurs d'exemple en production.

2. Lancer la stack :

   ```bash
   docker compose up -d --build
   ```

   Services : `db` (MySQL 8.3, base `sap_academy`, utilisateur `sap_user`), `migrate` (Prisma), `app` (port `${APP_PORT:-3000}`).

3. Vérifier :

   ```bash
   docker compose config   # doit afficher les variables sans erreur
   docker compose ps       # tous les services "healthy"/"exited (0)"
   ```

4. Arrêter :

   ```bash
   docker compose down        # conserve les données
   docker compose down -v     # supprime aussi le volume de données
   ```

Les variables obligatoires sont `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD` et `SESSION_SECRET` (voir `docker-compose.yml` avec `${VAR:?...}`). `APP_PORT` et `APP_ORIGIN` ont des valeurs par défaut.

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
```
