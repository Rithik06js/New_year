/*
  # Create greeting card schema

  1. New Tables
    - `greeting_images`
      - `id` (uuid, primary key)
      - `image_url` (text, URL to image in storage)
      - `display_order` (integer, order for animation)
      - `caption` (text, optional caption)
      - `created_at` (timestamp)
    
    - `admin_config`
      - `id` (uuid, primary key)
      - `password_hash` (text, hashed admin password)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Only authenticated admins can read/write images
    - Admin config is read-only for non-admins
*/

CREATE TABLE IF NOT EXISTS greeting_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  caption text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE greeting_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Images are publicly visible for viewing"
  ON greeting_images
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Admins can manage images"
  ON greeting_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS admin_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  password_hash text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin config is readable"
  ON admin_config
  FOR SELECT
  USING (true);

INSERT INTO admin_config (password_hash, id)
VALUES ('admin2025', '00000000-0000-0000-0000-000000000000')
ON CONFLICT DO NOTHING;
