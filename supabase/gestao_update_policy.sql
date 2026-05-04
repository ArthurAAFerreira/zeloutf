-- Permitir que usuários autenticados com acesso na gestao_acesso
-- atualizem ocorrências diretamente (sem precisar da senha admin).
-- Execute este script no SQL Editor do Supabase.

DROP POLICY IF EXISTS "gestao_can_update_ocorrencias" ON ocorrencias;

CREATE POLICY "gestao_can_update_ocorrencias"
  ON ocorrencias
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.gestao_acesso
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (true);
