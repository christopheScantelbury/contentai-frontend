'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAdminSecret } from '@/hooks/useAdminSecret';
import { getAdminStats, getAdminGenerations, AdminGeneration, AdminGenerationsResponse, AdminStats } from '@/lib/admin-api';

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null || rating === 0) {
    return <span className="text-gray-300 text-sm">—</span>;
  }

  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <span className="inline-flex items-center gap-0.5" title={`${rating.toFixed(1)} / 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalf && (
        <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} className="w-4 h-4 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-gray-500">{rating.toFixed(1)}</span>
    </span>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function AdminQualityPage() {
  const secret = useAdminSecret();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [data, setData] = useState<AdminGenerationsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  const perPage = 20;

  useEffect(() => {
    if (!secret) return;
    setStatsLoading(true);
    getAdminStats(secret)
      .then(setStats)
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, [secret]);

  const load = useCallback(
    async (p: number) => {
      if (!secret) return;
      setLoading(true);
      setError('');
      try {
        const result = await getAdminGenerations(secret, p, perPage);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar gerações');
      } finally {
        setLoading(false);
      }
    },
    [secret],
  );

  useEffect(() => {
    load(page);
  }, [load, page]);

  if (!secret) return null;

  const totalPages = data ? Math.ceil(data.total / perPage) : 1;
  const start = data ? (data.page - 1) * data.perPage + 1 : 0;
  const end = data ? Math.min(data.page * data.perPage, data.total) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Qualidade</h1>
        <p className="text-sm text-gray-500 mt-1">Gerações e feedback dos usuários</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Avaliação Média</p>
            {statsLoading ? (
              <div className="h-7 w-16 bg-gray-100 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                {stats && stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—'}
                {stats && stats.avgRating > 0 && (
                  <span className="text-sm font-normal text-gray-400 ml-1">/ 5</span>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#00D4FF]/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Total de Feedbacks</p>
            {statsLoading ? (
              <div className="h-7 w-16 bg-gray-100 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalFeedback.toLocaleString('pt-BR') : '—'}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Total de Gerações</p>
            {statsLoading ? (
              <div className="h-7 w-16 bg-gray-100 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalGenerations.toLocaleString('pt-BR') : '—'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Generations Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Gerações Recentes</h2>
        </div>

        {error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => load(page)}
              className="mt-2 text-sm text-red-500 underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                      Produto
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                      Categoria
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                      Data
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                      Tokens
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                      Avaliação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse w-40" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="h-4 bg-gray-100 rounded animate-pulse w-20 ml-auto" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="h-4 bg-gray-100 rounded animate-pulse w-12 ml-auto" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="h-4 bg-gray-100 rounded animate-pulse w-24 ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : data && data.generations.length > 0 ? (
                    data.generations.map((gen: AdminGeneration) => (
                      <tr key={gen.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium max-w-[200px] truncate">
                          {gen.productName}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            {gen.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-right">
                          {formatDate(gen.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-right tabular-nums">
                          {gen.tokensUsed.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end">
                            <StarRating rating={gen.rating} />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                        Nenhuma geração encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.total > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                <p className="text-sm text-gray-500">
                  {start}–{end} de {data.total.toLocaleString('pt-BR')} gerações
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Anterior
                  </button>
                  <span className="text-sm text-gray-500">
                    {page} / {totalPages}
                  </span>
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
