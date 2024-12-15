CREATE TABLE entries (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  parent_id INT,
  root_id INT,
  is_folder BOOLEAN NOT NULL DEFAULT false,
  FOREIGN KEY (parent_id) REFERENCES entries(id) ON DELETE CASCADE,
  FOREIGN KEY (root_id) REFERENCES entries(id) ON DELETE CASCADE
);


-- Parent_id's groups together for faster get_folder_entries
CREATE INDEX idx_parent_id ON entries (parent_id);
CLUSTER entries USING idx_parent_id;

-- Index for root entries
CREATE INDEX idx_root_entries ON entries (id) WHERE parent_id IS NULL;

-- Enforce unique titles for root entries
CREATE UNIQUE INDEX unique_root_title
ON entries (title)
WHERE parent_id IS NULL;
