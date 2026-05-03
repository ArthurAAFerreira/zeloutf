-- ================================================================
-- ZeloUTF · Tabela de Acesso à Gestão
-- Execute no Supabase SQL Editor: Dashboard → SQL Editor → New Query
-- ================================================================

-- 1. Criar a tabela de acesso
CREATE TABLE IF NOT EXISTS public.gestao_acesso (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  campus_ids text[]      NOT NULL DEFAULT '{}',
  papel      text        NOT NULL DEFAULT 'campus'
                         CHECK (papel IN ('admin_geral', 'campus')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Habilitar Row Level Security
ALTER TABLE public.gestao_acesso ENABLE ROW LEVEL SECURITY;

-- 3. Política: cada usuário lê apenas seu próprio registro
DROP POLICY IF EXISTS "gestao_acesso_self_select" ON public.gestao_acesso;
CREATE POLICY "gestao_acesso_self_select"
  ON public.gestao_acesso
  FOR SELECT
  USING (auth.uid() = user_id);

-- ================================================================
-- PASSO 2 · Criar o usuário "federer" com acesso total
--
-- a) Acesse: Supabase Dashboard → Authentication → Users → Add user
-- b) Preencha:
--      Email:  admin@zeloutf.edu.br   (ou qualquer e-mail)
--      Password: federer
-- c) Após criar, copie o UUID do usuário na lista de Users
-- d) Cole o UUID abaixo e execute este INSERT:
-- ================================================================

-- INSERT INTO public.gestao_acesso (user_id, campus_ids, papel)
-- VALUES ('COLE-O-UUID-AQUI', '{}', 'admin_geral');

-- ================================================================
-- PASSO 3 · Google OAuth (opcional)
--
-- 1. Supabase Dashboard → Authentication → Providers → Google → Enable
-- 2. Crie credenciais OAuth em console.cloud.google.com:
--    Authorized redirect URIs: https://<seu-projeto>.supabase.co/auth/v1/callback
-- 3. Cole Client ID e Secret no Supabase
-- 4. Adicione zeloutf.pages.dev (e localhost) em:
--    Supabase → Authentication → URL Configuration → Redirect URLs
-- ================================================================
