'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase';
import { generateContent, type GenerateResult } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'form' | 'loading' | 'result' | 'done';

interface Props {
  token: string;
  onComplete: () => void;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Eletrônicos', 'Moda', 'Casa e Decoração', 'Alimentos e Bebidas',
  'Beleza e Cuidados', 'Esportes', 'Brinquedos', 'Automotivo', 'Livros', 'Outros',
] as const;

const schema = z.object({
  name:     z.string().min(1, 'Nome é obrigatório').max(120),
  category: z.string().min(1, 'Selecione uma categoria'),
  features: z.string().min(1, 'Descreva as características').max(800),
});
type FormData = z.infer<typeof schema>;

// ─── Step indicators ──────────────────────────────────────────────────────────

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: 'Preencher' },
    { n: 2, label: 'Gerar' },
    { n: 3, label: 'Copiar' },
  ] as const;
  return (
    <div className="mb-6 flex items-center justify-center gap-0">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                s.n < current
                  ? 'bg-indigo-600 text-white'
                  : s.n === current
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s.n < current ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s.n
              )}
            </div>
            <span className={`mt-1 text-xs ${s.n === current ? 'font-semibold text-indigo-600' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`mb-4 h-0.5 w-12 sm:w-20 ${s.n < current ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Form ─────────────────────────────────────────────────────────────

function StepForm({ token, onGenerated }: { token: string; onGenerated: (r: GenerateResult) => void }) {
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError('');
    try {
      const result = await generateContent(
        { name: data.name, category: data.category, features: data.features },
        token,
      );
      onGenerated(result);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erro ao gerar conteúdo.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="ob-name" className="mb-1 block text-sm font-medium text-gray-700">
          Nome do produto <span className="text-red-500">*</span>
        </label>
        <input
          id="ob-name"
          type="text"
          placeholder="Ex: Tênis Running Pro 3000"
          {...register('name')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="ob-category" className="mb-1 block text-sm font-medium text-gray-700">
          Categoria <span className="text-red-500">*</span>
        </label>
        <select
          id="ob-category"
          {...register('category')}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Selecione…</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>}
      </div>

      <div>
        <label htmlFor="ob-features" className="mb-1 block text-sm font-medium text-gray-700">
          Características <span className="text-red-500">*</span>
        </label>
        <textarea
          id="ob-features"
          rows={3}
          placeholder="Material, cor, tamanho, diferenciais…"
          {...register('features')}
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {errors.features && <p className="mt-1 text-xs text-red-600">{errors.features.message}</p>}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Gerando conteúdo…
          </span>
        ) : (
          'Gerar conteúdo →'
        )}
      </button>
    </form>
  );
}

// ─── Step 2: Result ───────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-2 rounded p-1 text-gray-400 hover:text-indigo-600"
      title="Copiar"
    >
      {copied ? (
        <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

function StepResult({ result, onNext }: { result: GenerateResult; onNext: () => void }) {
  return (
    <div className="space-y-4">
      <section>
        <div className="mb-1 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Título</h4>
          <CopyBtn text={result.title} />
        </div>
        <p className="text-sm font-semibold text-gray-900">{result.title}</p>
      </section>

      <section>
        <div className="mb-1 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Descrição curta</h4>
          <CopyBtn text={result.shortDescription} />
        </div>
        <p className="text-sm text-gray-700">{result.shortDescription}</p>
      </section>

      <section>
        <div className="mb-1 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Descrição completa</h4>
          <CopyBtn text={result.longDescription} />
        </div>
        <p className="line-clamp-3 text-sm text-gray-700">{result.longDescription}</p>
      </section>

      {result.bullets?.length > 0 && (
        <section>
          <div className="mb-1 flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Pontos de venda</h4>
            <CopyBtn text={result.bullets.join('\n')} />
          </div>
          <ul className="space-y-1">
            {result.bullets.slice(0, 3).map((b, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="mt-0.5 text-indigo-500">•</span>
                {b}
              </li>
            ))}
          </ul>
        </section>
      )}

      <button
        type="button"
        onClick={onNext}
        className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
      >
        Continuar →
      </button>
    </div>
  );
}

// ─── Step 3: Done ─────────────────────────────────────────────────────────────

function StepDone({ onComplete }: { onComplete: () => void }) {
  const [saving, setSaving] = useState(false);

  async function handleGo() {
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({ data: { onboarding_completed: true } });
    } catch { /* não-crítico */ }
    onComplete();
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">Você está pronto!</h3>
        <p className="mt-1 text-sm text-gray-600">
          Agora você já sabe como gerar conteúdo profissional em segundos. Use os botões de cópia
          para colar nas suas lojas, marketplaces ou planilhas.
        </p>
      </div>
      <ul className="w-full space-y-2 text-left">
        {[
          'Preencha os dados do produto no formulário',
          'Clique em "Gerar conteúdo" e aguarde',
          'Copie cada campo com um clique',
        ].map((tip, i) => (
          <li key={i} className="flex items-start gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-800">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {tip}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handleGo}
        disabled={saving}
        className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {saving ? 'Entrando…' : 'Ir para o dashboard'}
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingWizard({ token, onComplete }: Props) {
  const [step,   setStep]   = useState<Step>('form');
  const [result, setResult] = useState<GenerateResult | null>(null);

  const stepNumber: 1 | 2 | 3 = step === 'form' ? 1 : step === 'loading' || step === 'result' ? 2 : 3;

  function handleGenerated(r: GenerateResult) {
    setResult(r);
    setStep('result');
  }

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 pt-6 pb-4">
          <h2 className="text-center text-xl font-bold text-gray-900">
            {step === 'form' && 'Boas-vindas ao ContentAI! 👋'}
            {(step === 'loading' || step === 'result') && 'Veja o resultado'}
            {step === 'done' && 'Pronto para decolar!'}
          </h2>
          <p className="mt-1 text-center text-sm text-gray-500">
            {step === 'form' && 'Vamos gerar seu primeiro conteúdo agora.'}
            {(step === 'loading' || step === 'result') && 'A IA criou tudo para você. Explore e copie.'}
            {step === 'done' && 'Você concluiu o tour. Use o dashboard quando quiser.'}
          </p>
        </div>

        {/* Steps indicator */}
        <div className="px-6 pt-5">
          <Steps current={stepNumber} />
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto px-6 pb-6">
          {step === 'form' && (
            <StepForm token={token} onGenerated={handleGenerated} />
          )}
          {step === 'result' && result && (
            <StepResult result={result} onNext={() => setStep('done')} />
          )}
          {step === 'done' && (
            <StepDone onComplete={onComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
