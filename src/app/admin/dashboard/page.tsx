'use client';
import { useEffect, useState } from 'react';
import { useAdminSecret } from '@/hooks/useAdminSecret';
import { getAdminStats, getAdminRevenue, AdminStats, AdminRevenue } from '@/lib/admin-api';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CHART_COLORS = ['#6B7280', '#0066CC', '#00D4FF'];
const PLAN_LABELS: Record<string, string> = { free: 'Free', starter: 'Starter', pro: 'Pro' };

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const secret = useAdminSecret();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [revenue, setRevenue] = useState<AdminRevenue | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!secret) return;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [s, r] = await Promise.all([
          getAdminStats(secret!),
          getAdminRevenue(secret!),
        ]);
        setStats(s);
        setRevenue(r);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [secret]);

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
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm text-red-600 underline"
          >
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
    {
      plan: 'Free',
      receita: revenue.planBreakdown.free * revenue.pricePerPlan.free,
      usuarios: revenue.planBreakdown.free,
    },
    {
      plan: 'Starter',
      receita: revenue.planBreakdown.starter * revenue.pricePerPlan.starter,
      usuarios: revenue.planBreakdown.starter,
    },
    {
      plan: 'Pro',
      receita: revenue.planBreakdown.pro * revenue.pricePerPlan.pro,
      usuarios: revenue.planBreakdown.pro,
    },
  ];

  const avgRatingDisplay =
    stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral da plataforma</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de Usuários"
          value={stats.totalUsers.toLocaleString('pt-BR')}
        />
        <StatCard
          label="Gerações Totais"
          value={stats.totalGenerations.toLocaleString('pt-BR')}
        />
        <StatCard
          label="Usuários Ativos (7d)"
          value={stats.activeUsersLast7d.toLocaleString('pt-BR')}
          sub="últimos 7 dias"
        />
        <StatCard
          label="Avaliação Média"
          value={avgRatingDisplay}
          sub={`${stats.totalFeedback.toLocaleString('pt-BR')} avaliações`}
        />
      </div>

      {/* MRR highlight */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">MRR Estimado</p>
          <p className="text-3xl font-bold text-gray-900">
            {revenue.estimatedMRR.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500">Usuários Pagantes</p>
          <p className="text-3xl font-bold text-[#00D4FF]">{revenue.paying}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Breakdown Pie */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Distribuição por Plano</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={planPieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) =>
                  `${PLAN_LABELS[name.toLowerCase()] ?? name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {planPieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Usuários']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Receita por Plano (R$)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueBarData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="plan" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) =>
                  v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`
                }
              />
              <Tooltip
                formatter={(value: number) => [
                  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                  'Receita',
                ]}
              />
              <Bar dataKey="receita" radius={[4, 4, 0, 0]}>
                {revenueBarData.map((_, index) => (
                  <Cell key={`bar-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
