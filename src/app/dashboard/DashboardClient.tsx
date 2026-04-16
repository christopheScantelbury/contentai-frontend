'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import ResultPanel from '@/components/ResultPanel';
import UsagePanel  from '@/components/UsagePanel';
import { createClient } from '@/lib/supabase';
import type { GenerateResult } from '@/lib/api';

interface Props {
  token:     string;
  userEmail: string;
  userId:    string;
}

export default function DashboardClient({ token, userEmail, userId }: Props) {
  const router    = useRouter();
  const [result,    setResult]    = useState<GenerateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold text-indigo-600">ContentAI</span>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-500 sm:block">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr_2fr]">
          {/* Coluna 1 — métricas */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Seu plano
            </h2>
            <UsagePanel token={token} />
          </div>

          {/* Coluna 2 — formulário */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Dados do produto
            </h2>
            <ProductForm
              token={token}
              onResult={setResult}
              onLoading={setIsLoading}
            />
          </div>

          {/* Coluna 3 — resultado */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Resultado
            </h2>
            <ResultPanel result={result} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}
