'use client';

import type { GenerateResult } from '@/lib/api';

interface Props {
  result:    GenerateResult | null;
  isLoading: boolean;
}

function SkeletonLine({ width = 'w-full' }: { width?: string }) {
  return (
    <div className={`h-3 animate-pulse rounded bg-gray-200 ${width}`} />
  );
}

function Skeleton() {
  return (
    <div className="space-y-4">
      <SkeletonLine width="w-1/2" />
      <div className="space-y-2">
        <SkeletonLine />
        <SkeletonLine width="w-5/6" />
      </div>
      <div className="space-y-2">
        <SkeletonLine />
        <SkeletonLine />
        <SkeletonLine width="w-4/6" />
      </div>
      <div className="space-y-2">
        <SkeletonLine width="w-3/4" />
        <SkeletonLine width="w-2/3" />
        <SkeletonLine width="w-5/6" />
        <SkeletonLine width="w-1/2" />
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback: ignore
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded p-1 text-gray-400 hover:text-indigo-600"
      title="Copiar"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    </button>
  );
}

export default function ResultPanel({ result, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Gerando conteúdo…
        </p>
        <Skeleton />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-400">
          Preencha o formulário e clique em <strong>Gerar conteúdo</strong> para ver o resultado aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
      {/* Título */}
      <section>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Título</h3>
          <CopyButton text={result.title} />
        </div>
        <p className="text-base font-semibold text-gray-900">{result.title}</p>
      </section>

      {/* Descrição curta */}
      <section>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Descrição curta</h3>
          <CopyButton text={result.shortDescription} />
        </div>
        <p className="text-sm text-gray-700">{result.shortDescription}</p>
      </section>

      {/* Descrição longa */}
      <section>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Descrição completa</h3>
          <CopyButton text={result.longDescription} />
        </div>
        <p className="whitespace-pre-wrap text-sm text-gray-700">{result.longDescription}</p>
      </section>

      {/* Bullets */}
      {result.bullets?.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Pontos de venda</h3>
            <CopyButton text={result.bullets.join('\n')} />
          </div>
          <ul className="space-y-1">
            {result.bullets.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="mt-0.5 text-indigo-500">•</span>
                {b}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Meta */}
      {(result.tokensUsed || result.generationTimeMs) && (
        <p className="text-right text-xs text-gray-400">
          {result.tokensUsed ? `${result.tokensUsed} tokens` : ''}
          {result.tokensUsed && result.generationTimeMs ? ' · ' : ''}
          {result.generationTimeMs ? `${(result.generationTimeMs / 1000).toFixed(1)}s` : ''}
        </p>
      )}
    </div>
  );
}
