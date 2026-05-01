import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { buscarResumoTodosCampus } from '../../services/ocorrencias';

type ResumoItem = { unidade: string; abertos: number; andamento: number; resolvidos: number; total: number };

export function DashboardGeral() {
  const [dados, setDados] = useState<ResumoItem[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        const resultado = await buscarResumoTodosCampus();
        setDados(resultado.sort((a, b) => b.total - a.total));
      } catch {
      } finally {
        setCarregando(false);
      }
    }
    void carregar();
  }, []);

  if (carregando) {
    return (
      <div className="mt-4 rounded-xl border border-indigo-100 bg-white/80 p-4 text-sm text-zinc-400">
        Carregando comparativo...
      </div>
    );
  }

  if (dados.length === 0) return null;

  const totalGeral = dados.reduce((sum, d) => sum + d.total, 0);
  const totalAbertos = dados.reduce((sum, d) => sum + d.abertos + d.andamento, 0);

  return (
    <div className="mt-4 rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-indigo-900">Panorama Geral dos Campus</h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            {totalGeral} relatos registrados · {totalAbertos} em aberto
          </p>
        </div>
        <div className="flex gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-4 rounded bg-amber-400" /> Abertos
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-4 rounded bg-blue-400" /> Em andamento
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-4 rounded bg-emerald-400" /> Concluídos
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={dados} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="unidade" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value} relatos`,
              name === 'abertos' ? 'Abertos' : name === 'andamento' ? 'Em andamento' : 'Concluídos',
            ]}
          />
          <Bar dataKey="abertos" name="Abertos" stackId="a" fill="#fbbf24" />
          <Bar dataKey="andamento" name="Em andamento" stackId="a" fill="#60a5fa" />
          <Bar dataKey="resolvidos" name="Concluídos" stackId="a" fill="#34d399" radius={[4, 4, 0, 0]} />
          <Legend
            formatter={(value) =>
              value === 'abertos'
                ? 'Abertos'
                : value === 'andamento'
                  ? 'Em andamento'
                  : 'Concluídos'
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
