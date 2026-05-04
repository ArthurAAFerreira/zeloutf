-- ================================================================
-- ZeloUTF · Políticas de acesso e consolidação de schema
-- Execute no Supabase → SQL Editor
-- ================================================================

-- ================================================================
-- PARTE 1: zeloutf.gestao_acesso (deve existir antes das policies)
-- ================================================================

-- 1. Criar tabela zeloutf.gestao_acesso
CREATE TABLE IF NOT EXISTS zeloutf.gestao_acesso (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  campus_ids text[]      NOT NULL DEFAULT '{}',
  papel      text        NOT NULL DEFAULT 'campus'
                         CHECK (papel IN ('admin_geral', 'campus')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Copiar dados existentes de public.gestao_acesso (se houver)
INSERT INTO zeloutf.gestao_acesso (id, user_id, campus_ids, papel, created_at)
SELECT id, user_id, campus_ids, papel, created_at
FROM public.gestao_acesso
ON CONFLICT (user_id) DO NOTHING;

-- 3. RLS e grants para zeloutf.gestao_acesso
GRANT USAGE ON SCHEMA zeloutf TO authenticated;
GRANT SELECT ON zeloutf.gestao_acesso TO authenticated;
ALTER TABLE zeloutf.gestao_acesso ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gestao_acesso_self_select" ON zeloutf.gestao_acesso;
CREATE POLICY "gestao_acesso_self_select"
  ON zeloutf.gestao_acesso
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- ================================================================
-- PARTE 2: zeloutf.ocorrencias — acesso e políticas
-- ================================================================

-- 4. Grants de tabela
GRANT USAGE ON SCHEMA zeloutf TO anon;
GRANT SELECT        ON zeloutf.ocorrencias TO anon;
GRANT SELECT        ON zeloutf.ocorrencias TO authenticated;
GRANT UPDATE        ON zeloutf.ocorrencias TO authenticated;

-- 5. Habilitar RLS
ALTER TABLE zeloutf.ocorrencias ENABLE ROW LEVEL SECURITY;

-- 6. Policy SELECT — anon (feed público, leitura irrestrita)
DROP POLICY IF EXISTS "anon_can_select_ocorrencias" ON zeloutf.ocorrencias;
CREATE POLICY "anon_can_select_ocorrencias"
  ON zeloutf.ocorrencias
  FOR SELECT TO anon
  USING (true);

-- 7. Policy SELECT — authenticated (gestão e usuários logados)
DROP POLICY IF EXISTS "authenticated_can_select_ocorrencias" ON zeloutf.ocorrencias;
CREATE POLICY "authenticated_can_select_ocorrencias"
  ON zeloutf.ocorrencias
  FOR SELECT TO authenticated
  USING (true);

-- 8. Policy UPDATE — somente usuários com acesso à gestão
DROP POLICY IF EXISTS "gestao_can_update_ocorrencias" ON zeloutf.ocorrencias;
CREATE POLICY "gestao_can_update_ocorrencias"
  ON zeloutf.ocorrencias
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM zeloutf.gestao_acesso
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (true);

-- 9. Colunas de localização do relator (se não existirem)
ALTER TABLE zeloutf.ocorrencias
  ADD COLUMN IF NOT EXISTS lat_relator DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS lon_relator DOUBLE PRECISION;
