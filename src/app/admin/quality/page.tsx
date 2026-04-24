'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAdminSecret } from '@/hooks/useAdminSecret';
import { getAdminStats, getAdminGenerations, AdminGeneration } from '@/lib/admin-api';

function ratingColor(rating: number | null) {
  if (rating === null) return 'border-gray-200 bg-gray-50';
  if (rating >= 4) return 'border-green-200 bg-green-50';
  if (rating <= 2) return 'border-red-200 bg-red-50';
  return 'border-yellow-200 bg-yellow-50';
}

function ratingLabel(rating: number | null) {
  if (rating === null) return { text: 'Sem avaliação', color: 'text-gray-400' };
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  if (rating >= 4) return { text: stars, color: 'text-green-600' };
  if (rating <= 2) return { text: stars, color: 'text-red-500' };
  return { text: stars, color: 'text-yellow-500' };
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

function GenerationCard({ gen }: { gen: AdminGeneration }) {
  const { text, color } = ratingLabel(gen.rating);
  return (
    <div className={`rounded-xl border p-4 ${ratingColor(gen.rating)} transition-shadow hover:shadow-sm`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{gen.productName || '—'}</p>
          <p className="text-xs text-gray-500 mt-0.5">{gen.category || 'Sem categoria'}</p>
        </div>
        <span className={`text-sm font-medium shrink-0 ${color}`}>{text}</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span className="font-mono truncate max-w-[120px]">{gen.userId.slice(0, 8)}…</span>
        <span>{gen.tokensUsed.toLocaleString('pt-BR')} tokens</span>
        <span>{formatDate(gen.createdAt)}</span>
      </div>
    </div>
  );
}

export default function AdminQualityPage() {
  const secret = useAdminSecret();
  const [generations, setGenerations] = useState<AdminGeneration[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [avgRating, setAvgRating] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const perPage = 18;

  const load = useCallback(
    async (p: number) => {
      if (!secret) return;
      setLoading(true);
      setError('');
      try {
        const [g, s] = await Promise.all([
          getAdminGenerations(secret, p, perPage),
          p === 1 ? getAdminStats(secret) : Promise.resolve(null),
        ]);
        setGenerations(g.generations);
        setTotal(g.total);
        if (s) { setAvgRating(s.avgRating); setTotalFeedback(s.totalFeedback); }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar gerações');
      } finally {
        setLoading(false);
      }
    },
    [secret],
  );

  useEffect(() => { load(page); }, [load, page]);

  if (!secret) return null;

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gerações</h1>
        <p className="text-sm text-gray-500 mt-1">Qualidade e histórico de conteúdo gerado</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Avaliação Média</p>
          <p className="text-2xl font-bold text-gray-900">
            {avgRating > 0 ? `${avgRating.toFixed(1)} ★` : '—'}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total de Avaliações</p>
          <p className="text-2xl font-bold text-gray-900">{totalFeedback.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total de Gerações</p>
          <p className="text-2xl font-bold text-gray-900">{total.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-green-200 border border-green-300" />
          4–5★ Bom
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-yellow-100 border border-yellow-300" />
          3★ Médio
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-red-100 border border-red-300" />
          1–2★ Ruim
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-gray-100 border border-gray-200" />
          Sem avaliação
        </span>
      </div>

      {/* Cards grid */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">{error}</p>
          <button onClick={() => load(page)} className="mt-2 text-sm text-red-500 underline">
            Tentar novamente
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4 h-24 animate-pulse" />
          ))}
        </div>
      ) : generations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {generations.map((g) => (
            <GenerationCard key={g.id} gen={g} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-sm text-gray-400">Nenhuma geração encontrada</div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Página {page} de {totalPages} — {total.toLocaleString('pt-BR')} gerações
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Anterior
            </button>
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
    </div>
  );
}
