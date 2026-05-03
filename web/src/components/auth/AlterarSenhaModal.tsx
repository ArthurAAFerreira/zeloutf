import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { alterarSenha } from '../../lib/auth';
import { Button } from '../ui/Button';

interface AlterarSenhaModalProps {
  onFechar: () => void;
}

export function AlterarSenhaModal({ onFechar }: AlterarSenhaModalProps) {
  const [nova, setNova] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  async function salvar() {
    if (nova.length < 6) { setErro('Mínimo 6 caracteres.'); return; }
    if (nova !== confirmar) { setErro('As senhas não conferem.'); return; }
    setSalvando(true);
    setErro(null);
    try {
      await alterarSenha(nova);
      setSucesso(true);
      setTimeout(onFechar, 1500);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao alterar senha.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 bg-zinc-50 px-5 py-4">
          <div>
            <p className="text-xs font-medium text-zinc-400">Conta</p>
            <h3 className="mt-0.5 text-base font-semibold text-zinc-900">Alterar Senha</h3>
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
              Nova senha
            </label>
            <input
              type="password"
              className="input"
              autoFocus
              value={nova}
              onChange={(e) => { setNova(e.target.value); setErro(null); }}
              onKeyDown={(e) => { if (e.key === 'Enter') void salvar(); }}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Confirmar nova senha
            </label>
            <input
              type="password"
              className="input"
              value={confirmar}
              onChange={(e) => { setConfirmar(e.target.value); setErro(null); }}
              onKeyDown={(e) => { if (e.key === 'Enter') void salvar(); }}
              placeholder="••••••••"
            />
          </div>

          {erro ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>
          ) : null}

          {sucesso ? (
            <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" /> Senha alterada com sucesso!
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-100 px-5 py-4">
          <Button type="button" onClick={onFechar}>Cancelar</Button>
          <Button type="button" variant="primary" disabled={salvando || sucesso} onClick={salvar}>
            {salvando ? 'Salvando...' : 'Alterar senha'}
          </Button>
        </div>
      </div>
    </div>
  );
}
