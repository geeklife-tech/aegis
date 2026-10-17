/*
# Create trajectories table for AEGIS Protocol Node

1. New Tables
- `trajectories`
  - `id` (uuid, primary key)
  - `problem` (text, the problem being solved)
  - `attempt` (text, the attempted solution)
  - `correction` (text, the correction or feedback)
  - `privacy_mode` (text, the active privacy mode when logged: locked, minimized, pseudonymous, monetizable)
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `trajectories`.
- Single-tenant no-auth app: allow anon + authenticated full CRUD since data is intentionally shared.
*/

CREATE TABLE IF NOT EXISTS trajectories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem text NOT NULL,
  attempt text NOT NULL,
  correction text NOT NULL,
  privacy_mode text NOT NULL DEFAULT 'pseudonymous',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trajectories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_trajectories" ON trajectories;
CREATE POLICY "anon_select_trajectories" ON trajectories FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_trajectories" ON trajectories;
CREATE POLICY "anon_insert_trajectories" ON trajectories FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_trajectories" ON trajectories;
CREATE POLICY "anon_update_trajectories" ON trajectories FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_trajectories" ON trajectories;
CREATE POLICY "anon_delete_trajectories" ON trajectories FOR DELETE
TO anon, authenticated USING (true);
