import { useState } from 'react';
import { LogIn, X } from 'lucide-react';
import { fazerLogin, fazerLoginGoogle } from '../../lib/auth';
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

  async function entrar() {
    const raw = email.trim();
    const s = senha.trim();
    if (!raw || !s) { setErro('Preencha usuário e senha.'); return; }
    const e = raw.includes('@') ? raw : raw + '@zelo.utfpr';
    setCarregando(true);
    setErro(null);
    try {
      await fazerLogin(e, s);
      onSucesso();
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao fazer login.');
    } finally {
      setCarregando(false);
    }
  }

  async function entrarGoogle() {
    setCarregando(true);
    setErro(null);
    try {
      await fazerLoginGoogle();
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao conectar com Google.');
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

          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t border-zinc-200" />
            <span className="text-xs text-zinc-400">ou</span>
            <div className="flex-1 border-t border-zinc-200" />
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-50"
            disabled={carregando}
            onClick={entrarGoogle}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </button>
        </div>

        <div className="border-t border-zinc-100 px-5 py-3 text-center">
          <p className="text-xs text-zinc-400">Apenas usuários autorizados têm acesso à gestão.</p>
        </div>
      </div>
    </div>
  );
}
