-- Bootstrap initial admin user row for the `users` table.
-- Run this in Supabase SQL editor after you've created a Supabase Auth user (email/password).
-- Replace <AUTH_UID> with the auth user's id (uuid) from Supabase Auth users list.

INSERT INTO users (auth_uid, email, full_name, role, is_super)
VALUES ('<AUTH_UID>', 'admin@example.com', 'Primary Admin', 'Admin', true);

-- If you don't want to link to auth_uid, you can insert without it, but then link later.
-- INSERT INTO users (email, full_name, role, is_super) VALUES ('admin@example.com', 'Primary Admin', 'Admin', true);
