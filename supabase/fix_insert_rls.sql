-- ================================================================
-- Fix INSERT RLS em zeloutf.ocorrencias
-- Cole e execute no Supabase → SQL Editor
-- ================================================================

-- 1. Remove TODAS as policies de INSERT existentes (limpeza total)
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'zeloutf'
      AND tablename  = 'ocorrencias'
      AND cmd        = 'INSERT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON zeloutf.ocorrencias', pol.policyname);
    RAISE NOTICE 'Removed INSERT policy: %', pol.policyname;
  END LOOP;
END $$;

-- 2. Garante o GRANT de INSERT para anon
GRANT INSERT ON zeloutf.ocorrencias TO anon;

-- 3. Desativa e reativa RLS para resetar estado interno
ALTER TABLE zeloutf.ocorrencias DISABLE ROW LEVEL SECURITY;
ALTER TABLE zeloutf.ocorrencias ENABLE ROW LEVEL SECURITY;

-- 4. Cria policy de INSERT limpa para anon
CREATE POLICY "allow_anon_insert_ocorrencias"
  ON zeloutf.ocorrencias
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 5. Diagnóstico: mostra o estado final das policies
SELECT
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'zeloutf'
  AND tablename  = 'ocorrencias'
ORDER BY cmd, policyname;
