import { useEffect, useState } from 'react';
import { LogIn, X } from 'lucide-react';
import { fazerLogin } from '../../lib/auth';
import { db } from '../../lib/supabase';
import { Button } from '../ui/Button';

interface LoginModalProps {
  onSucesso: () => void;
  onFechar: () => void;
}

export function LoginModal({ onSucesso, onFechar }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    void db.schema('zeloutf').from('gestao_acesso').select('papel').limit(1);
  }, []);

  async function entrar() {
    const raw = email.trim();
    const s = senha.trim();
    if (!raw || !s) { setErro('Preencha usuário e senha.'); return; }
    const e = raw.includes('@') ? raw : raw + '@zelo.utfpr';
    setCarregando(true);
    setErro(null);
    void db.schema('zeloutf').from('gestao_acesso').select('papel').limit(1);
    try {
      await fazerLogin(e, s);
      onSucesso();
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao fazer login.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 bg-zinc-50 px-5 py-4">
          <div>
            <p className="text-xs font-medium text-zinc-400">Sistema ZeloUTF · UTFPR</p>
            <h3 className="mt-0.5 text-base font-semibold text-zinc-900">Acesso à Gestão</h3>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="shrink-0 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-700"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Usuário
            </label>
            <input
              type="text"
              className="input"
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErro(null); }}
              onKeyDown={(e) => { if (e.key === 'Enter') void entrar(); }}
              placeholder="dirpladct"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Senha
            </label>
            <input
              type="password"
              className="input"
              value={senha}
              onChange={(e) => { setSenha(e.target.value); setErro(null); }}
              onKeyDown={(e) => { if (e.key === 'Enter') void entrar(); }}
              placeholder="••••••••"
            />
          </div>

          {erro ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>
          ) : null}

          <Button type="button" variant="primary" className="w-full" disabled={carregando} onClick={entrar}>
            <LogIn className="mr-1.5 inline h-4 w-4" />
            {carregando ? 'Entrando...' : 'Entrar'}
          </Button>

        </div>

        <div className="border-t border-zinc-100 px-5 py-3 text-center">
          <p className="text-xs text-zinc-400">Apenas usuários autorizados têm acesso à gestão.</p>
        </div>
      </div>
    </div>
  );
}
