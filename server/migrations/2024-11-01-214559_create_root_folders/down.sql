DELETE FROM entries
WHERE title IN ('Fonts', 'Notes', 'Gallery')
AND parent_id IS NULL
AND is_folder = true;