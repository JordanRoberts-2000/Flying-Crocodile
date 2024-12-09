-- Drop the index for root entries
DROP INDEX IF EXISTS idx_root_entries;

-- Remove clustering and drop the index on parent_id
ALTER TABLE entries SET WITHOUT CLUSTER;
DROP INDEX IF EXISTS idx_parent_id;

-- Drop the entries table
DROP TABLE IF EXISTS entries CASCADE;

