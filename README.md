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

## Checks

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
```
