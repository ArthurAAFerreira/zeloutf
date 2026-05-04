import { useState } from 'react';
import { CheckCircle2, Clock, ExternalLink, X } from 'lucide-react';
import type { OcorrenciaResumo } from '../../services/ocorrencias';
import { gerenciarOcorrencia, gerenciarOcorrenciaAutenticado } from '../../services/ocorrencias';
import { Button } from '../ui/Button';

interface GestaoModalProps {
  relato: OcorrenciaResumo;
  onFechar: () => void;
  onSalvo: () => void;
  temSessao?: boolean;
}

const STATUS_OPTIONS = [
  { value: 'pendente', label: 'Aberto' },
  { value: 'em_verificacao', label: 'Em andamento' },
  { value: 'resolvido', label: 'Concluído' },
] as const;

export function GestaoModal({ relato, onFechar, onSalvo, temSessao }: GestaoModalProps) {
  const [status, setStatus] = useState(relato.status);
  const [complemento, setComplemento] = useState(relato.complemento_admin ?? '');
  const [adminKey, setAdminKey] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function salvar() {
    if (!temSessao) {
      const senha = adminKey.trim();
      if (!senha) {
        setErro('Informe a senha admin para salvar.');
        return;
      }
    }
    setSalvando(true);
    setErro(null);
    setMensagem(null);
    try {
      const payload = { id: relato.id, status, complemento_admin: complemento, gerenciado_por: 'admin-gestao' };
      if (temSessao) {
        await gerenciarOcorrenciaAutenticado(payload);
      } else {
        await gerenciarOcorrencia(payload, adminKey.trim());
      }
      setMensagem('Atendimento salvo com sucesso!');
      setTimeout(() => {
        onSalvo();
      }, 900);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao salvar atendimento.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 bg-zinc-50 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-400">
              #{relato.id_curto} · {relato.bloco} · {relato.local}
            </p>
            <h3 className="mt-0.5 truncate text-base font-semibold text-zinc-900">{relato.problema}</h3>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-500">
              <Clock className="h-3 w-3" />
              {relato.created_at ? new Date(relato.created_at).toLocaleDateString('pt-BR') : '-'}
              {relato.reforcos > 0 && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
                  {relato.reforcos} reforço{relato.reforcos !== 1 ? 's' : ''}
                </span>
              )}
            </div>
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
          {relato.descricao_detalhada ? (
            <div className="rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              {relato.descricao_detalhada}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Novo status
              </label>
              <select
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {!temSessao ? (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Senha admin
              </label>
              <input
                type="password"
                className="input"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void salvar();
                  }
                }}
                placeholder="••••••••"
              />
            </div>
          ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Complemento Gestão
            </label>
            <textarea
              className="input min-h-[80px]"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              placeholder="Ações tomadas, observações, próximos passos..."
            />
          </div>

          {relato.foto_url ? (
            <a href={relato.foto_url} target="_blank" rel="noreferrer" className="inline-block">
              <img
                src={relato.foto_url}
                alt="Foto do relato"
                className="h-20 rounded-xl border border-zinc-200 object-cover"
              />
            </a>
          ) : null}

          {erro ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p> : null}
          {mensagem ? (
            <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" /> {mensagem}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-zinc-100 px-5 py-4">
          <a
            href={`/relato/${relato.id_curto}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Acessar página do relato
          </a>
          <div className="flex gap-2">
            <Button type="button" onClick={onFechar}>Cancelar</Button>
            <Button type="button" variant="primary" disabled={salvando} onClick={salvar}>
              {salvando ? 'Salvando...' : 'Salvar atendimento'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
