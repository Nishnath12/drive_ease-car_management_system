-- Run once against an existing production database.
-- This is intentionally separate from database.sql so existing data is preserved.
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active TINYINT(1) NOT NULL DEFAULT 1;
