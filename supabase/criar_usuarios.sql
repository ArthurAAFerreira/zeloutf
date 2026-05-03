-- ================================================================
-- ZeloUTF · Criação de usuários por campus
-- Execute no Supabase SQL Editor APÓS rodar gestao_acesso.sql
--
-- Formato de login: zelo.{perfil}{campus}   senha = mesmo texto
-- Exemplos: zelo.dirpladct / zelo.dirgect / zelo.utfprct
--
-- Campus: ct ld cp ap cm dv fb gp md pb pg sh td
-- Total: 13 campus × 5 perfis = 65 usuários + 1 admin (zeloutf)
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

  -- ── 65 usuários de campus ─────────────────────────────────────
  FOREACH c IN ARRAY campus_list LOOP
    FOREACH p IN ARRAY prefixo_list LOOP
      usuario := 'zelo.' || p || c;   -- ex: zelo.dirpladct

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
          json_build_object('sub', novo_id::text, 'email', usuario || '@gestao.local'),
          'email',
          now(), now(), now(),
          usuario || '@gestao.local'
        );

      ELSE
        SELECT id INTO novo_id FROM auth.users
        WHERE email = usuario || '@gestao.local';
      END IF;

      INSERT INTO public.gestao_acesso (user_id, campus_ids, papel)
      VALUES (novo_id, ARRAY[c], 'campus')
      ON CONFLICT (user_id) DO NOTHING;

    END LOOP;
  END LOOP;

  -- ── Admin geral: zeloutf / federer ────────────────────────────
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'zeloutf@gestao.local'
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
      'zeloutf@gestao.local',
      crypt('federer', gen_salt('bf')),
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
      json_build_object('sub', novo_id::text, 'email', 'zeloutf@gestao.local'),
      'email',
      now(), now(), now(),
      'zeloutf@gestao.local'
    );

  ELSE
    SELECT id INTO novo_id FROM auth.users WHERE email = 'zeloutf@gestao.local';
  END IF;

  INSERT INTO public.gestao_acesso (user_id, campus_ids, papel)
  VALUES (novo_id, ARRAY[]::text[], 'admin_geral')
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
