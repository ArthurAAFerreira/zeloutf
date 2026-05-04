import { db } from './supabase';
import type { Session } from '@supabase/supabase-js';

export type { Session };

export interface GestaoAcesso {
  papel: 'admin_geral' | 'campus';
  campus_ids: string[];
}

export async function fazerLogin(email: string, senha: string): Promise<Session> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Servidor demorou demais. Verifique sua conexão e tente novamente.')), 30000)
  );
  const login = db.auth.signInWithPassword({ email, password: senha }).then(({ data, error }) => {
    if (error) throw new Error(error.message);
    if (!data.session) throw new Error('Sessão não retornada. Tente novamente.');
    return data.session;
  });
  return Promise.race([login, timeout]);
}

export async function fazerLoginGoogle(): Promise<void> {
  const { error } = await db.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/gestao` },
  });
  if (error) throw new Error(error.message);
}

export async function fazerLogout(): Promise<void> {
  await db.auth.signOut({ scope: 'local' });
}

export async function alterarSenha(novaSenha: string): Promise<void> {
  const { error } = await db.auth.updateUser({ password: novaSenha });
  if (error) throw new Error(error.message);
}

export async function buscarAcessoGestao(): Promise<GestaoAcesso | null> {
  try {
    const query = db.schema('zeloutf').from('gestao_acesso').select('papel, campus_ids').maybeSingle();
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 8000)
    );
    const { data, error } = await Promise.race([query, timeout]);
    if (error) return null;
    return data ? (data as GestaoAcesso) : null;
  } catch {
    return null;
  }
}
