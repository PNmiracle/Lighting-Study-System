CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  case_id TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  uploaded_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS case_states (
  case_id TEXT PRIMARY KEY,
  state_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS crm_records (
  resource TEXT NOT NULL,
  record_id TEXT NOT NULL,
  data_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  PRIMARY KEY (resource, record_id)
);

CREATE TABLE IF NOT EXISTS crm_seed_meta (
  seed_name TEXT PRIMARY KEY,
  version INTEGER NOT NULL,
  applied_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_crm_records_resource_updated
  ON crm_records (resource, updated_at);
