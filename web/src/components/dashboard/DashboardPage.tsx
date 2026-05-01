import { useEffect, useState } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { ArrowLeft, BarChart3, MapPin, RefreshCw, Shield, Star, TrendingUp, Zap } from 'lucide-react';
import { buscarEstatisticasCampus, type EstatisticasCampus } from '../../services/ocorrencias';

interface DashboardPageProps {
  campusId: string;
  campusNome: string;
  onVoltar: () => void;
}

const PALETTE = ['#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

function KpiCard({ label, value, cor, sub }: { label: string; value: string | number; cor: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-bold" style={{ color: cor }}>{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-slate-400">{sub}</p> : null}
    </div>
  );
}

function InsightItem({ n, cor, icon: Icon, title, value }: { n: number; cor: string; icon: React.ElementType; title: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold" style={{ background: cor }}>
        {n}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">{value}</p>
      </div>
      <Icon className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
    </div>
  );
}

export function DashboardPage({ campusId, campusNome, onVoltar }: DashboardPageProps) {
  const [stats, setStats] = useState<EstatisticasCampus | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizado, setAtualizado] = useState('');

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const r = await buscarEstatisticasCampus(campusId);
      setStats(r);
      setAtualizado(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao carregar.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { void carregar(); }, [campusId]);

  const pieData = stats?.porStatus.map((s) => ({ name: s.label, value: s.total, cor: s.cor })) ?? [];
  const maxBloco = Math.max(...(stats?.porBloco.map((b) => b.abertos + b.resolvidos) ?? [1]), 1);
  const maxLocal = Math.max(...(stats?.porLocal.map((l) => l.total) ?? [1]), 1);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onVoltar} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" /> Painel de Gestão
          </button>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
            <span className="font-semibold text-slate-800">Dashboard · {campusNome}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {atualizado ? <span className="text-xs text-slate-400">Atualizado {atualizado}</span> : null}
          <button type="button" onClick={() => void carregar()} disabled={carregando}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">
            <RefreshCw className={`h-3.5 w-3.5 ${carregando ? 'animate-spin' : ''}`} /> Atualizar
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-6">
        {erro ? <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</div> : null}
        {carregando && !stats ? (
          <div className="flex h-64 items-center justify-center text-slate-400">Carregando dados...</div>
        ) : stats ? (
          <div className="space-y-6">

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
              <KpiCard label="Total de relatos" value={stats.totalRelatos} cor="#1e293b" />
              <KpiCard label="Abertos" value={stats.totalAbertos} cor="#f59e0b" sub={`${Math.round((stats.totalAbertos / (stats.totalRelatos || 1)) * 100)}%`} />
              <KpiCard label="Em andamento" value={stats.totalEmAndamento} cor="#3b82f6" sub={`${Math.round((stats.totalEmAndamento / (stats.totalRelatos || 1)) * 100)}%`} />
              <KpiCard label="Concluídos" value={stats.totalResolvidos} cor="#10b981" sub={`${stats.insights.taxaResolucao}% resolvidos`} />
              <KpiCard label="Total reforços" value={stats.totalReforcos} cor="#8b5cf6" />
              <KpiCard label="Média reforços" value={stats.insights.mediaReforcosPorRelato} cor="#06b6d4" sub="por relato" />
            </div>

            {/* Row 1: Status donut + Tipo + Categoria */}
            <div className="grid gap-4 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-slate-700">Distribuição por Status</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={78} innerRadius={42} dataKey="value" paddingAngle={3}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v} relatos`, '']} />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-slate-700">Por Tipo</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.porTipo} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="tipo" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="total" name="Relatos" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-slate-700">Por Grupo / Categoria</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.porCategoria} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="total" name="Relatos" fill="#f59e0b" radius={[6, 6, 0, 0]}>
                      {stats.porCategoria.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 2: Evolução mensal */}
            {stats.porMes.length > 1 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-slate-700">Evolução Mensal de Relatos (últimos 12 meses)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={stats.porMes} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradAbertos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="total" name="Total criados" stroke="#6366f1" fill="url(#gradTotal)" strokeWidth={2} />
                    <Area type="monotone" dataKey="abertos" name="Ainda abertos" stroke="#f59e0b" fill="url(#gradAbertos)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Row 3: Bloco + Local */}
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-slate-700">Relatos por Bloco <span className="font-normal text-slate-400">(top {stats.porBloco.length})</span></h3>
                <div className="space-y-2">
                  {stats.porBloco.map((b) => {
                    const total = b.abertos + b.resolvidos;
                    return (
                      <div key={b.bloco} className="flex items-center gap-2 text-xs">
                        <span className="w-24 shrink-0 truncate text-right text-slate-500">{b.bloco}</span>
                        <div className="flex h-5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full bg-amber-400" style={{ width: `${(b.abertos / maxBloco) * 100}%` }} title={`Abertos: ${b.abertos}`} />
                          <div className="h-full bg-emerald-400" style={{ width: `${(b.resolvidos / maxBloco) * 100}%` }} title={`Concluídos: ${b.resolvidos}`} />
                        </div>
                        <span className="w-8 shrink-0 font-semibold text-slate-700">{total}</span>
                      </div>
                    );
                  })}
                  <div className="flex gap-4 pt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><span className="h-2 w-3 rounded bg-amber-400 inline-block" /> Abertos</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-3 rounded bg-emerald-400 inline-block" /> Concluídos</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-slate-700">Locais com Mais Problemas <span className="font-normal text-slate-400">(top {stats.porLocal.length})</span></h3>
                <div className="space-y-2">
                  {stats.porLocal.map((l, i) => (
                    <div key={l.local} className="flex items-center gap-2 text-xs">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: PALETTE[i % PALETTE.length] }}>{i + 1}</span>
                      <span className="min-w-0 flex-1 truncate text-slate-600">{l.local}</span>
                      <div className="h-4 shrink-0 overflow-hidden rounded-full bg-slate-100" style={{ width: 80 }}>
                        <div className="h-full bg-indigo-400" style={{ width: `${(l.total / maxLocal) * 100}%` }} />
                      </div>
                      <span className="w-8 shrink-0 text-right font-semibold text-slate-700">{l.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 4: Sede + Insights */}
            <div className="grid gap-4 xl:grid-cols-3">
              {stats.porSede.length > 1 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">Por Sede</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.porSede} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="sede" tick={{ fontSize: 10 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="total" name="Relatos" radius={[6, 6, 0, 0]}>
                        {stats.porSede.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${stats.porSede.length > 1 ? '' : 'xl:col-span-2'}`}>
                <h3 className="mb-3 text-sm font-semibold text-slate-700">Por Natureza do Relato</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={stats.porNatureza.map((n, i) => ({ name: n.natureza, value: n.total, cor: PALETTE[i] }))}
                      cx="50%" cy="50%" outerRadius={75} innerRadius={40} dataKey="value" paddingAngle={4}>
                      {stats.porNatureza.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v} relatos`, '']} />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50 p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-slate-700">Análises e Destaques</h3>
                <div className="space-y-2">
                  <InsightItem n={1} cor="#ef4444" icon={MapPin} title="Local mais problemático" value={stats.insights.localMaisProblematico} />
                  <InsightItem n={2} cor="#f59e0b" icon={Shield} title="Bloco mais problemático" value={stats.insights.blocoMaisProblematico} />
                  <InsightItem n={3} cor="#10b981" icon={TrendingUp} title="Taxa de resolução" value={`${stats.insights.taxaResolucao}% resolvidos`} />
                  <InsightItem n={4} cor="#3b82f6" icon={Star} title="Engajamento (reforços)" value={`Média ${stats.insights.mediaReforcosPorRelato} por relato`} />
                  <InsightItem n={5} cor="#8b5cf6" icon={Zap} title="Período com mais registros" value={stats.insights.mesComMaisRelatos} />
                  {stats.porSede.length > 1 && (
                    <InsightItem n={6} cor="#06b6d4" icon={BarChart3} title="Sede com mais relatos" value={stats.insights.sedeComMaisRelatos} />
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : null}
      </main>
    </div>
  );
}
