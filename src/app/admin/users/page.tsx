'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useAdminSecret } from '@/hooks/useAdminSecret';
import { getAdminUsers, AdminUser, AdminUsersResponse } from '@/lib/admin-api';

const PLAN_BADGE: Record<string, { label: string; className: string }> = {
  free:    { label: 'Free',    className: 'bg-gray-100 text-gray-600' },
  starter: { label: 'Starter', className: 'bg-blue-100 text-blue-700' },
  pro:     { label: 'Pro',     className: 'bg-purple-100 text-purple-700' },
};

function PlanBadge({ plan }: { plan: string }) {
  const badge = PLAN_BADGE[plan] ?? { label: plan, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
      {badge.label}
    </span>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return iso; }
}

function exportCSV(users: AdminUser[]) {
  const header = 'Email,Plano,Créditos Usados,Cadastro';
  const rows = users.map((u) =>
    [u.email, u.plan, u.creditsUsed, formatDate(u.createdAt)].join(','),
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `usuarios-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminUsersPage() {
  const secret = useAdminSecret();
  const [data, setData] = useState<AdminUsersResponse | null>(null);
  const [page, setPage] = useState(1);
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const perPage = 20;

  const load = useCallback(
    async (p: number, plan: string) => {
      if (!secret) return;
      setLoading(true);
      setError('');
      try {
        const result = await getAdminUsers(secret, p, perPage, plan === 'all' ? undefined : plan);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    },
    [secret],
  );

  useEffect(() => {
    load(page, planFilter);
  }, [load, page, planFilter]);

  function handlePlanChange(value: string) {
    setPlanFilter(value);
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      load(1, planFilter);
    }, 350);
  }

  if (!secret) return null;

  const filtered = data
    ? search.trim()
      ? data.users.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()))
      : data.users
    : [];

  const totalPages = data ? Math.ceil(data.total / perPage) : 1;
  const start = data ? (data.page - 1) * data.perPage + 1 : 0;
  const end = data ? Math.min(data.page * data.perPage, data.total) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          {data && (
            <p className="text-sm text-gray-500 mt-1">
              {data.total.toLocaleString('pt-BR')} usuários cadastrados
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Email search */}
          <input
            type="search"
            placeholder="Buscar por email…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-3 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent w-52"
          />

          {/* Plan filter */}
          <select
            value={planFilter}
            onChange={(e) => handlePlanChange(e.target.value)}
            className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent"
          >
            <option value="all">Todos os planos</option>
            <option value="free">Free</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
          </select>

          {/* CSV Export */}
          <button
            onClick={() => data && exportCSV(data.users)}
            disabled={!data || loading}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button onClick={() => load(page, planFilter)} className="mt-2 text-sm text-red-500 underline">
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {['Email', 'Plano', 'Créditos usados', 'Cadastro'].map((h, i) => (
                      <th
                        key={h}
                        className={`text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3 ${i > 1 ? 'text-right' : 'text-left'}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-48" /></td>
                        <td className="px-6 py-4"><div className="h-5 bg-gray-100 rounded-full animate-pulse w-16" /></td>
                        <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-100 rounded animate-pulse w-12 ml-auto" /></td>
                        <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-100 rounded animate-pulse w-24 ml-auto" /></td>
                      </tr>
                    ))
                  ) : filtered.length > 0 ? (
                    filtered.map((user: AdminUser) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">{user.email}</td>
                        <td className="px-6 py-4"><PlanBadge plan={user.plan} /></td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-right tabular-nums">
                          {user.creditsUsed.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-right">{formatDate(user.createdAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {data && data.total > 0 && !search.trim() && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                <p className="text-sm text-gray-500">
                  {start}–{end} de {data.total.toLocaleString('pt-BR')} usuários
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Anterior
                  </button>
                  <span className="text-sm text-gray-500">{page} / {totalPages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Próximo →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
