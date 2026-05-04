-- Permitir que usuários autenticados com acesso na gestao_acesso
-- atualizem ocorrências diretamente (sem precisar da senha admin).
-- Execute no Supabase → SQL Editor.
-- IMPORTANTE: a tabela está no schema "zeloutf".

-- 1. Garantir acesso ao schema zeloutf para o papel authenticated
GRANT USAGE ON SCHEMA zeloutf TO authenticated;
GRANT SELECT, UPDATE ON zeloutf.ocorrencias TO authenticated;

-- 2. Habilitar RLS (caso ainda não esteja habilitado)
ALTER TABLE zeloutf.ocorrencias ENABLE ROW LEVEL SECURITY;

-- 3. Policy de UPDATE para gestão
DROP POLICY IF EXISTS "gestao_can_update_ocorrencias" ON zeloutf.ocorrencias;

CREATE POLICY "gestao_can_update_ocorrencias"
  ON zeloutf.ocorrencias
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.gestao_acesso
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (true);

-- 4. Adicionar colunas de localização do relator (se não existirem)
ALTER TABLE zeloutf.ocorrencias
  ADD COLUMN IF NOT EXISTS lat_relator DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS lon_relator DOUBLE PRECISION;
