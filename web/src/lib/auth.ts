import { db } from './supabase';
import type { Session } from '@supabase/supabase-js';

export type { Session };

export interface GestaoAcesso {
  papel: 'admin_geral' | 'campus';
  campus_ids: string[];
}

export async function fazerLogin(email: string, senha: string): Promise<Session> {
  const { data, error } = await db.auth.signInWithPassword({ email, password: senha });
  if (error) throw new Error(error.message);
  if (!data.session) throw new Error('Sessão não retornada. Tente novamente.');
  return data.session;
}

export async function fazerLoginGoogle(): Promise<void> {
  const { error } = await db.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/gestao` },
  });
  if (error) throw new Error(error.message);
}

export async function fazerLogout(): Promise<void> {
  await db.auth.signOut();
}

export async function alterarSenha(novaSenha: string): Promise<void> {
  const { error } = await db.auth.updateUser({ password: novaSenha });
  if (error) throw new Error(error.message);
}

export async function buscarAcessoGestao(): Promise<GestaoAcesso | null> {
  const { data, error } = await db
    .from('gestao_acesso')
    .select('papel, campus_ids')
    .single();
  if (error || !data) return null;
  return data as GestaoAcesso;
}
