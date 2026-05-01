import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { buscarEstatisticasCampus, type EstatisticasCampus } from '../../services/ocorrencias';

interface DashboardCampusProps {
  campusId: string;
}

function KpiCard({ label, value, cor }: { label: string; value: number; cor?: string }) {
  return (
    <div className="kpi-card">
      <span className="kpi-value" style={cor ? { color: cor } : undefined}>
        {value}
      </span>
      <span className="kpi-label">{label}</span>
    </div>
  );
}

export function DashboardCampus({ campusId }: DashboardCampusProps) {
  const [stats, setStats] = useState<EstatisticasCampus | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(null);
      try {
        const resultado = await buscarEstatisticasCampus(campusId);
        setStats(resultado);
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Falha ao carregar estatísticas.');
      } finally {
        setCarregando(false);
      }
    }
    void carregar();
  }, [campusId]);

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-zinc-400">
        Carregando dashboard...
      </div>
    );
  }

  if (erro) {
    return <p className="py-4 text-sm text-red-600">{erro}</p>;
  }

  if (!stats) return null;

  const pieData = stats.porStatus.map((s) => ({
    name: s.label,
    value: s.total,
    cor: s.cor,
  }));

  const maxBloco = Math.max(...stats.porBloco.map((b) => b.abertos + b.resolvidos), 1);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Total de relatos" value={stats.totalRelatos} />
        <KpiCard label="Abertos" value={stats.totalAbertos} cor="#f59e0b" />
        <KpiCard label="Em andamento" value={stats.totalEmAndamento} cor="#3b82f6" />
        <KpiCard label="Concluídos" value={stats.totalResolvidos} cor="#10b981" />
        <KpiCard label="Total reforços" value={stats.totalReforcos} />
        <KpiCard label="Com reforço" value={stats.relatosComReforco} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="dash-chart-card">
          <h4 className="dash-chart-title">Distribuição por Status</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={72}
                innerRadius={36}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v} relatos`, '']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="dash-chart-card">
          <h4 className="dash-chart-title">Por Tipo</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.porTipo} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="tipo" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => [`${v} relatos`, 'Total']} />
              <Bar dataKey="total" name="Relatos" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {stats.porBloco.length > 0 && (
        <div className="dash-chart-card">
          <h4 className="dash-chart-title">
            Relatos por Bloco{' '}
            <span className="font-normal text-zinc-400">(top {stats.porBloco.length})</span>
          </h4>
          <div className="space-y-2 pt-1">
            {stats.porBloco.map((b) => {
              const total = b.abertos + b.resolvidos;
              const pctAberto = maxBloco > 0 ? (b.abertos / maxBloco) * 100 : 0;
              const pctResolvido = maxBloco > 0 ? (b.resolvidos / maxBloco) * 100 : 0;
              return (
                <div key={b.bloco} className="flex items-center gap-2 text-xs">
                  <span className="w-20 shrink-0 truncate text-right text-zinc-500">{b.bloco}</span>
                  <div className="flex h-5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full bg-amber-400 transition-all"
                      style={{ width: `${pctAberto}%` }}
                      title={`Abertos: ${b.abertos}`}
                    />
                    <div
                      className="h-full bg-emerald-400 transition-all"
                      style={{ width: `${pctResolvido}%` }}
                      title={`Concluídos: ${b.resolvidos}`}
                    />
                  </div>
                  <span className="w-8 shrink-0 font-semibold text-zinc-700">{total}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-3 pt-1 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-4 rounded bg-amber-400" /> Abertos
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-4 rounded bg-emerald-400" /> Concluídos
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
