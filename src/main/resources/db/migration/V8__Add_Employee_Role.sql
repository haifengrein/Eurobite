-- Add missing role column required by JPA schema validation
ALTER TABLE employee
    ADD COLUMN IF NOT EXISTS role VARCHAR(32) NOT NULL DEFAULT 'STAFF';

-- Backfill known accounts
UPDATE employee SET role = 'ADMIN' WHERE username = 'admin';
UPDATE employee SET role = 'CHEF' WHERE username = 'chef';
