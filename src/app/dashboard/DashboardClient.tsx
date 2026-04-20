'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm, { type ProductFormHandle } from '@/components/ProductForm';
import ResultPanel        from '@/components/ResultPanel';
import UsagePanel         from '@/components/UsagePanel';
import HistoryPanel       from '@/components/HistoryPanel';
import OnboardingWizard   from '@/components/OnboardingWizard';
import { createClient } from '@/lib/supabase';
import type { GenerateResult } from '@/lib/api';

type Tab = 'gerar' | 'historico';

interface Props {
  token:              string;
  userEmail:          string;
  userId:             string;
  showOnboarding:     boolean;
}

export default function DashboardClient({ token: initialToken, userEmail, userId, showOnboarding }: Props) {
  const router    = useRouter();
  const formRef   = useRef<ProductFormHandle>(null);

  const [tab,             setTab]             = useState<Tab>('gerar');
  const [result,          setResult]          = useState<GenerateResult | null>(null);
  const [isLoading,       setIsLoading]       = useState(false);
  const [generationId,    setGenerationId]    = useState<string | null>(null);
  const [wizardVisible,   setWizardVisible]   = useState(showOnboarding);

  // Mantém o token sempre atualizado — o Supabase renova o JWT automaticamente
  const [token, setToken] = useState(initialToken);

  useEffect(() => {
    const supabase = createClient();

    // Garante que temos o token mais recente ao montar o componente
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.access_token) setToken(data.session.access_token);
    });

    // Atualiza sempre que o Supabase renovar o token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) setToken(session.access_token);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  async function handleResult(res: GenerateResult) {
    setResult(res);
    setGenerationId(null);

    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('generations')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data?.id) setGenerationId(data.id as string);
    } catch {
      // sem generation_id — StarRating não aparece
    }
  }

  function handleReuse(data: { name: string; category: string; features: string }) {
    setTab('gerar');
    // pequeno delay para garantir que o componente foi montado
    setTimeout(() => formRef.current?.fill(data), 50);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {wizardVisible && (
        <OnboardingWizard
          token={token}
          onComplete={() => setWizardVisible(false)}
        />
      )}
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold text-brand">Descrição AI</span>
          <nav className="hidden gap-1 sm:flex">
            {(['gerar', 'historico'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === t
                    ? 'bg-brand/10 text-brand'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t === 'gerar' ? 'Gerar' : 'Histórico'}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 lg:block">{userEmail}</span>
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
        {tab === 'gerar' ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr_2fr]">
            {/* Coluna 1 — métricas */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Seu plano</h2>
              <UsagePanel token={token} />
            </div>

            {/* Coluna 2 — formulário */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Dados do produto
              </h2>
              <ProductForm
                ref={formRef}
                token={token}
                onResult={handleResult}
                onLoading={setIsLoading}
              />
            </div>

            {/* Coluna 3 — resultado + rating */}
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Resultado</h2>
              <ResultPanel
                result={result}
                isLoading={isLoading}
                generationId={generationId}
                token={token}
              />
            </div>
          </div>
        ) : (
          <HistoryPanel userId={userId} onReuse={handleReuse} />
        )}
      </main>
    </div>
  );
}
