# Restore the lab database

1. Download the dump: `aws s3 cp s3://ccm-lab-backups/db/<file>.dump . --endpoint-url https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com`
2. In Neon, create a new branch `restore-test` (empty or from main).
3. Restore: `pg_restore --no-owner --clean --if-exists -d "<restore-test direct URI>" <file>.dump`
4. Point a local `.env` `DATABASE_URI` at `restore-test`, run `npm run dev`, log in to `/admin`, confirm users, markets, and media records exist.
5. Delete the `restore-test` branch.

Restore test: pending (run after the GitHub secrets are set).
