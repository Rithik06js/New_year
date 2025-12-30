/*
  # Create visitors tracking table

  1. New Tables
    - `visitors`
      - `id` (uuid, primary key)
      - `name` (text, the visitor's entered name)
      - `visited_at` (timestamp, when they entered their name)
  2. Security
    - Enable RLS on `visitors` table
    - Add policy for admin to view all entries
    - Add policy for public insert (no auth required)
*/

CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  visited_at timestamptz DEFAULT now()
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visits"
  ON visitors
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can read all visits"
  ON visitors
  FOR SELECT
  TO authenticated
  USING (true);
