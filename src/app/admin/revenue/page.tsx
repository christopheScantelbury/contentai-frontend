'use client';
import { useEffect, useState } from 'react';
import { useAdminSecret } from '@/hooks/useAdminSecret';
import { getAdminRevenue, AdminRevenue } from '@/lib/admin-api';

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminRevenuePage() {
  const secret = useAdminSecret();
  const [data, setData]     = useState<AdminRevenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!secret) return;
    getAdminRevenue(secret)
      .then(setData)
      .catch(() => setError('Erro ao carregar dados de receita'))
      .finally(() => setLoading(false));
  }, [secret]);

  if (!secret || loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data)  return null;

  const mrr = data.estimatedMRR.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Receita</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="MRR Estimado" value={mrr} />
        <StatCard label="Usuários Pagantes" value={String(data.paying)} />
        <StatCard label="Total de Planos" value={String(data.planBreakdown.free + data.planBreakdown.starter + data.planBreakdown.pro)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Plano', 'Usuários', 'Preço/mês', 'Receita'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(['free', 'starter', 'pro'] as const).map(plan => {
              const count = data.planBreakdown[plan];
              const price = data.pricePerPlan[plan];
              return (
                <tr key={plan} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium capitalize">{plan}</td>
                  <td className="px-6 py-4 text-gray-600">{count}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {price === 0 ? 'Grátis' : price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {(count * price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
