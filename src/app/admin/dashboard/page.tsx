'use client';
import { useEffect, useState, useMemo } from 'react';
import { useAdminSecret } from '@/hooks/useAdminSecret';
import {
  getAdminStats,
  getAdminRevenue,
  getAdminGenerations,
  AdminStats,
  AdminRevenue,
  AdminGeneration,
} from '@/lib/admin-api';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CHART_COLORS = ['#6B7280', '#0066CC', '#00D4FF'];

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${accent ? 'text-[#00D4FF]' : 'text-gray-900'}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function buildDailyChart(generations: AdminGeneration[], days = 14) {
  const counts: Record<string, number> = {};
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    counts[d.toISOString().slice(0, 10)] = 0;
  }
  for (const g of generations) {
    const day = g.createdAt.slice(0, 10);
    if (day in counts) counts[day]++;
  }
  return Object.entries(counts).map(([date, total]) => ({
    date: date.slice(5),
    total,
  }));
}

export default function AdminDashboardPage() {
  const secret = useAdminSecret();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [revenue, setRevenue] = useState<AdminRevenue | null>(null);
  const [recentGens, setRecentGens] = useState<AdminGeneration[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!secret) return;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [s, r, g] = await Promise.all([
          getAdminStats(secret!),
          getAdminRevenue(secret!),
          getAdminGenerations(secret!, 1, 200),
        ]);
        setStats(s);
        setRevenue(r);
        setRecentGens(g.generations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [secret]);

  const dailyChart = useMemo(() => buildDailyChart(recentGens, 14), [recentGens]);

  const today = new Date().toISOString().slice(0, 10);
  const geracoesHoje = recentGens.filter((g) => g.createdAt.slice(0, 10) === today).length;

  if (!secret) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-sm text-red-600 underline">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!stats || !revenue) return null;

  const planPieData = [
    { name: 'Free', value: stats.planBreakdown.free },
    { name: 'Starter', value: stats.planBreakdown.starter },
    { name: 'Pro', value: stats.planBreakdown.pro },
  ];

  const revenueBarData = [
    { plan: 'Free', receita: revenue.planBreakdown.free * revenue.pricePerPlan.free },
    { plan: 'Starter', receita: revenue.planBreakdown.starter * revenue.pricePerPlan.starter },
    { plan: 'Pro', receita: revenue.planBreakdown.pro * revenue.pricePerPlan.pro },
  ];

  const mrr = revenue.estimatedMRR.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const avgRatingDisplay = stats.avgRating > 0 ? `${stats.avgRating.toFixed(1)} ★` : '—';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral da plataforma</p>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="MRR Estimado" value={mrr} sub={`${revenue.paying} pagantes`} accent />
        <StatCard
          label="Usuários Ativos"
          value={stats.activeUsersLast7d.toLocaleString('pt-BR')}
          sub="últimos 7 dias"
        />
        <StatCard
          label="Gerações Hoje"
          value={geracoesHoje.toLocaleString('pt-BR')}
          sub={`${stats.totalGenerations.toLocaleString('pt-BR')} no total`}
        />
        <StatCard
          label="NPS Médio"
          value={avgRatingDisplay}
          sub={`${stats.totalFeedback.toLocaleString('pt-BR')} avaliações`}
        />
      </div>

      {/* Line chart — generations/day */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Gerações por dia (últimos 14 dias)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dailyChart} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip formatter={(value) => [Number(value).toLocaleString('pt-BR'), 'Gerações']} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#00D4FF"
              strokeWidth={2}
              dot={{ r: 3, fill: '#00D4FF' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Breakdown Pie */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Distribuição por Plano</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={planPieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={false}
                labelLine={false}
              >
                {planPieData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${Number(value).toLocaleString('pt-BR')} usuários`]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Receita por Plano (R$)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueBarData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="plan" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => (v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`)}
              />
              <Tooltip
                formatter={(value) => [
                  Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                  'Receita',
                ]}
              />
              <Bar dataKey="receita" radius={[4, 4, 0, 0]}>
                {revenueBarData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
