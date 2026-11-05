# Restore the lab database

Prerequisites: local `pg_restore` must be version 18 or newer (the dump is made with the v18 client). For step 1, export the R2 access key and secret as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

1. Download the dump: `aws s3 cp s3://ccm-lab-backups/db/<file>.dump . --endpoint-url https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com`
2. In Neon, create a new branch `restore-test` (empty or from main).
3. Restore: `pg_restore --no-owner --clean --if-exists -d "<restore-test direct URI>" <file>.dump`
4. Point a local `.env` `DATABASE_URI` at `restore-test`, run `npm run dev`, log in to `/admin`, confirm users, markets, and media records exist.
5. Delete the `restore-test` branch.

Note: GitHub disables scheduled workflows after 60 days without repo activity. If backups stop appearing, re-enable the `db-backup` workflow in the repo's Actions tab.

Restore test: PASSED 2026-11-05 — db/ccm-lab-2026-11-05T2142Z.dump restored into a temporary Neon branch with pg_restore 18.6 (Homebrew `libpq`, /opt/homebrew/opt/libpq/bin): 15 tables, 1 admin user, 2 markets, 3 migrations. Branch deleted afterwards.
