-- ================================================================
-- Fix rápido: permissões zeloutf.ocorrencias
-- Execute no Supabase → SQL Editor
-- ================================================================

-- GRANTS
GRANT USAGE ON SCHEMA zeloutf TO anon;
GRANT USAGE ON SCHEMA zeloutf TO authenticated;
GRANT SELECT ON zeloutf.ocorrencias TO anon;
GRANT SELECT ON zeloutf.ocorrencias TO authenticated;
GRANT INSERT ON zeloutf.ocorrencias TO anon;
GRANT UPDATE ON zeloutf.ocorrencias TO authenticated;

-- Ativar RLS (idempotente)
ALTER TABLE zeloutf.ocorrencias ENABLE ROW LEVEL SECURITY;

-- SELECT anon
DROP POLICY IF EXISTS "anon_can_select_ocorrencias" ON zeloutf.ocorrencias;
CREATE POLICY "anon_can_select_ocorrencias"
  ON zeloutf.ocorrencias FOR SELECT TO anon USING (true);

-- SELECT authenticated
DROP POLICY IF EXISTS "authenticated_can_select_ocorrencias" ON zeloutf.ocorrencias;
CREATE POLICY "authenticated_can_select_ocorrencias"
  ON zeloutf.ocorrencias FOR SELECT TO authenticated USING (true);

-- INSERT anon
DROP POLICY IF EXISTS "anon_can_insert_ocorrencias" ON zeloutf.ocorrencias;
CREATE POLICY "anon_can_insert_ocorrencias"
  ON zeloutf.ocorrencias FOR INSERT TO anon WITH CHECK (true);
