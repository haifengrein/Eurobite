-- Ensure seeded employee accounts have valid bcrypt hashes.
-- This fixes invalid placeholder hashes in earlier seed data so B-end login works.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

UPDATE employee
SET password = crypt('123456', gen_salt('bf', 10))
WHERE username IN ('admin', 'manager', 'chef')
  AND (
    password IS NULL
    OR password !~ '^\$2[aby]\$[0-9]{2}\$[./0-9A-Za-z]{53}$'
  );
