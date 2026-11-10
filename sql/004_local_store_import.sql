ALTER TABLE subscriptions
  ADD COLUMN plan_id VARCHAR(120) NULL;

CREATE TABLE local_store_imports (
  source_checksum CHAR(64) PRIMARY KEY,
  imported_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
