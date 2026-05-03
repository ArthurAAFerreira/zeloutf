-- ================================================================
-- ZeloUTF · Criação de usuários por campus
-- Execute no Supabase SQL Editor APÓS rodar gestao_acesso.sql
--
-- Usuários criados por campus (senha = nome do usuário):
--   dirplad{campus}  dirge{campus}  deseg{campus}
--   depro{campus}    utfpr{campus}
--
-- Campus: ct ld cp ap cm dv fb gp md pb pg sh td
-- Total: 13 campus × 5 perfis = 65 usuários
-- ================================================================

DO $$
DECLARE
  c            text;
  p            text;
  usuario      text;
  novo_id      uuid;
  campus_list  text[] := ARRAY['ct','ld','cp','ap','cm','dv','fb','gp','md','pb','pg','sh','td'];
  prefixo_list text[] := ARRAY['dirplad','dirge','deseg','depro','utfpr'];
BEGIN

  FOREACH c IN ARRAY campus_list LOOP
    FOREACH p IN ARRAY prefixo_list LOOP
      usuario := p || c;

      -- Criar usuário se ainda não existir
      IF NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = usuario || '@gestao.local'
      ) THEN
        novo_id := gen_random_uuid();

        INSERT INTO auth.users (
          id, instance_id, aud, role,
          email, encrypted_password, email_confirmed_at,
          raw_app_meta_data, raw_user_meta_data,
          is_super_admin, created_at, updated_at
        ) VALUES (
          novo_id,
          '00000000-0000-0000-0000-000000000000',
          'authenticated', 'authenticated',
          usuario || '@gestao.local',
          crypt(usuario, gen_salt('bf')),
          now(),
          '{"provider":"email","providers":["email"]}',
          '{"email_verified":true}',
          false, now(), now()
        );

        INSERT INTO auth.identities (
          id, user_id, identity_data, provider,
          last_sign_in_at, created_at, updated_at, provider_id
        ) VALUES (
          gen_random_uuid(),
          novo_id,
          json_build_object(
            'sub',   novo_id::text,
            'email', usuario || '@gestao.local'
          ),
          'email',
          now(), now(), now(),
          usuario || '@gestao.local'
        );

      ELSE
        SELECT id INTO novo_id
        FROM auth.users
        WHERE email = usuario || '@gestao.local';
      END IF;

      -- Vincular usuário ao campus na tabela de acesso
      INSERT INTO public.gestao_acesso (user_id, campus_ids, papel)
      VALUES (novo_id, ARRAY[c], 'campus')
      ON CONFLICT (user_id) DO NOTHING;

    END LOOP;
  END LOOP;

  -- ── Usuário administrador (Arthur) ───────────────────────────
  INSERT INTO public.gestao_acesso (user_id, campus_ids, papel)
  VALUES (
    '4f655024-47c9-46b5-86a9-296cbb05c6ed',
    ARRAY[]::text[],
    'admin_geral'
  )
  ON CONFLICT (user_id) DO UPDATE
    SET papel = 'admin_geral', campus_ids = ARRAY[]::text[];

  RAISE NOTICE '✓ Usuários ZeloUTF criados com sucesso!';
END $$;

-- ================================================================
-- VERIFICAR resultado
-- ================================================================
-- SELECT u.email, ga.papel, ga.campus_ids
-- FROM auth.users u
-- JOIN public.gestao_acesso ga ON ga.user_id = u.id
-- ORDER BY u.email;
