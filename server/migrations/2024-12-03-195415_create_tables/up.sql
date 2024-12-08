CREATE TABLE entries (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  parent_id INT,
  is_folder BOOLEAN NOT NULL DEFAULT false,
  FOREIGN KEY (parent_id) REFERENCES entries(id) ON DELETE CASCADE
)
