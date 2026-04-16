'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import type { GenerateResult } from '@/lib/api';

const PAGE_SIZE = 20;

interface GenerationRow {
  id:           string;
  product_name: string;
  category:     string;
  features:     string;
  result:       GenerateResult;
  created_at:   string;
}

interface Props {
  userId:    string;
  onReuse?:  (data: { name: string; category: string; features: string }) => void;
}

async function fetchGenerations(userId: string, page: number): Promise<{ rows: GenerationRow[]; total: number }> {
  const supabase = createClient();
  const from     = page * PAGE_SIZE;
  const to       = from + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from('generations')
    .select('id, product_name, category, features, result, created_at', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  return { rows: (data ?? []) as GenerationRow[], total: count ?? 0 };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function HistoryPanel({ userId, onReuse }: Props) {
  const [page,     setPage]     = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey:  ['generations', userId, page],
    queryFn:   () => fetchGenerations(userId, page),
    staleTime: 30_000,
  });

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        Não foi possível carregar o histórico. Verifique se o RLS do Supabase permite leitura de &quot;generations&quot;.
      </div>
    );
  }

  if (!data?.rows.length) {
    return (
      <div className="flex min-h-[180px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-400">Nenhuma geração ainda. Crie seu primeiro conteúdo!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Histórico
        </h2>
        <span className="text-xs text-gray-400">{data.total} geraç{data.total === 1 ? 'ão' : 'ões'}</span>
      </div>

      <div className="space-y-2">
        {data.rows.map((row) => (
          <div
            key={row.id}
            className="rounded-xl border border-gray-200 bg-white overflow-hidden"
          >
            {/* Header do card */}
            <button
              type="button"
              onClick={() => setExpanded(expanded === row.id ? null : row.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {row.product_name}
                </p>
                <p className="text-xs text-gray-400">
                  {row.category} · {formatDate(row.created_at)}
                </p>
              </div>
              <svg
                className={`ml-3 h-4 w-4 shrink-0 text-gray-400 transition-transform ${expanded === row.id ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Conteúdo expandido */}
            {expanded === row.id && (
              <div className="border-t border-gray-100 px-4 py-3 space-y-3">
                {/* Título gerado */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Título</p>
                  <p className="mt-0.5 text-sm text-gray-800">{row.result.title}</p>
                </div>

                {/* Descrição curta */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Descrição curta</p>
                  <p className="mt-0.5 text-sm text-gray-700">{row.result.shortDescription}</p>
                </div>

                {/* Bullets */}
                {row.result.bullets?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Bullets</p>
                    <ul className="mt-1 space-y-0.5">
                      {row.result.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2 text-xs text-gray-600">
                          <span className="text-indigo-400">•</span>{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ações */}
                {onReuse && (
                  <button
                    type="button"
                    onClick={() => onReuse({ name: row.product_name, category: row.category, features: row.features })}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Usar novamente
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Anterior
          </button>
          <span className="text-xs text-gray-400">
            Página {page + 1} de {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
