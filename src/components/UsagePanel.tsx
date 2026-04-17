'use client';

import { useQuery } from '@tanstack/react-query';
import { getUsage, type Plan } from '@/lib/api';
import Link from 'next/link';

interface Props {
  token: string;
}

const PLAN_LABEL: Record<Plan, string> = {
  free:    'Grátis',
  starter: 'Starter',
  pro:     'Pro',
};

const PLAN_COLOR: Record<Plan, string> = {
  free:    'bg-gray-100 text-gray-600',
  starter: 'bg-blue-100 text-blue-700',
  pro:     'bg-brand/15 text-brand-dark',
};

function formatResetDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
}

function SkeletonUsage() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="h-4 w-16 rounded bg-gray-200" />
      </div>
      <div className="h-2 rounded-full bg-gray-200" />
      <div className="h-3 w-32 rounded bg-gray-200" />
    </div>
  );
}

export default function UsagePanel({ token }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey:  ['usage', token],
    queryFn:   () => getUsage(token),
    refetchInterval: 60_000, // sincroniza com cache de 60s do backend
  });

  if (isLoading) return <SkeletonUsage />;

  if (isError || !data) {
    return (
      <p className="text-xs text-gray-400">Não foi possível carregar métricas.</p>
    );
  }

  const isPro          = data.plan === 'pro';
  const limit          = data.credits_limit ?? 1;
  const used           = data.credits_used;
  const remaining      = data.credits_remaining;
  const pct            = isPro ? 100 : Math.min(100, Math.round((used / limit) * 100));
  const isLow          = !isPro && remaining !== null && limit > 0 && (remaining / limit) < 0.2;

  // cor da barra: normal → indigo, baixo → amarelo/laranja
  const barColor = isLow ? 'bg-amber-500' : 'bg-brand/100';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      {/* Header: plano + total de gerações */}
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${PLAN_COLOR[data.plan]}`}>
          {PLAN_LABEL[data.plan]}
        </span>
        <span className="text-xs text-gray-500">
          {data.total_generations} geraç{data.total_generations === 1 ? 'ão' : 'ões'} no total
        </span>
      </div>

      {/* Créditos */}
      {isPro ? (
        <p className="text-sm font-medium text-brand">Gerações ilimitadas ✓</p>
      ) : (
        <>
          <div className="flex justify-between text-xs text-gray-600">
            <span>
              <strong>{used}</strong>/{limit} créditos usados
            </span>
            <span className={isLow ? 'font-semibold text-amber-600' : ''}>
              {remaining} restantes
            </span>
          </div>

          {/* Barra de progresso */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </>
      )}

      {/* Reset date */}
      <p className="text-xs text-gray-400">
        Créditos renovam em <strong>{formatResetDate(data.reset_at)}</strong>
      </p>

      {/* Upgrade CTA quando < 20% */}
      {isLow && (
        <Link
          href="/planos"
          className="block w-full rounded-lg bg-amber-500 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-amber-600"
        >
          ⚡ Fazer upgrade — créditos acabando
        </Link>
      )}
    </div>
  );
}
