-- Global revision covers all athletes, ownership references, enrollment and drains.
CREATE TABLE IF NOT EXISTS authority_revision (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  revision INTEGER NOT NULL CONSTRAINT stale_revision CHECK (revision >= 0)
);
INSERT OR IGNORE INTO authority_revision (id, revision) VALUES (1, 0);
CREATE TABLE IF NOT EXISTS authority_rows (
  athlete TEXT NOT NULL,
  collection TEXT NOT NULL,
  row_id TEXT NOT NULL,
  value TEXT NOT NULL CHECK (json_valid(value)),
  PRIMARY KEY (athlete, collection, row_id)
);
-- Operations use (athlete, collection='operations', row_id=op_id) as their PK.
CREATE UNIQUE INDEX IF NOT EXISTS authority_device_sequence ON authority_rows
  (athlete, json_extract(row_id, '$[0]'), json_extract(row_id, '$[1]')) WHERE collection = 'slots';
CREATE UNIQUE INDEX IF NOT EXISTS authority_log_position ON authority_rows
  (athlete, CAST(row_id AS INTEGER)) WHERE collection = 'log';
CREATE TABLE IF NOT EXISTS authority_subjects (
  subject TEXT PRIMARY KEY,
  athlete TEXT NOT NULL UNIQUE
);
