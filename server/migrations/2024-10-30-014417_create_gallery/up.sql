CREATE TABLE entries (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  parentId INT,
  FOREIGN KEY (parentId) REFERENCES entries(id) ON DELETE CASCADE
)
