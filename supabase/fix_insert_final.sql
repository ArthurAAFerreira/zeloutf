-- ================================================================
-- Fix DEFINITIVO: INSERT em zeloutf.ocorrencias
-- ================================================================

-- 1. Remove TODAS as policies de INSERT existentes
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'zeloutf' AND tablename = 'ocorrencias' AND cmd = 'INSERT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON zeloutf.ocorrencias', pol.policyname);
  END LOOP;
END $$;

-- 2. Garante GRANTs para anon e authenticated
GRANT USAGE  ON SCHEMA zeloutf                 TO anon, authenticated;
GRANT INSERT ON zeloutf.ocorrencias            TO anon, authenticated;
GRANT USAGE  ON ALL SEQUENCES IN SCHEMA zeloutf TO anon, authenticated;

-- 3. Recria RLS
ALTER TABLE zeloutf.ocorrencias DISABLE ROW LEVEL SECURITY;
ALTER TABLE zeloutf.ocorrencias ENABLE  ROW LEVEL SECURITY;

-- 4. Policy SEM restricao de role (cobre anon + authenticated + qualquer outro)
CREATE POLICY "public_can_insert_ocorrencias"
  ON zeloutf.ocorrencias
  FOR INSERT
  WITH CHECK (true);

-- 5. Força PostgREST a recarregar o cache de schema
NOTIFY pgrst, 'reload schema';

-- 6. Diagnóstico final
SELECT policyname, cmd, roles, with_check
FROM pg_policies
WHERE schemaname = 'zeloutf' AND tablename = 'ocorrencias'
ORDER BY cmd;
