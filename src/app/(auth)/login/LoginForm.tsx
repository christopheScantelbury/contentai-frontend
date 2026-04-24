'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';

const schema = z.object({
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router     = useRouter();
  const params     = useSearchParams();
  const redirectTo = params.get('redirectTo') ?? '/dashboard';
  const [serverError,   setServerError]   = useState('');
  const [showReset,     setShowReset]     = useState(false);
  const [resetEmail,    setResetEmail]    = useState('');
  const [resetStatus,   setResetStatus]   = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError('');
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email:    data.email,
      password: data.password,
    });

    if (error) {
      setServerError(
        error.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : error.message,
      );
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  async function handleReset() {
    if (!resetEmail) return;
    setResetStatus('sending');
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: 'https://www.descricaoai.com.br/nova-senha',
    });
    setResetStatus(error ? 'error' : 'sent');
  }

  if (showReset) {
    return (
      <>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
          <div>
            <label htmlFor="reset-email" className="mb-1 block text-sm font-medium">
              E-mail
            </label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          {resetStatus === 'sent' && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              Link enviado! Verifique seu e-mail.
            </p>
          )}
          {resetStatus === 'error' && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              Erro ao enviar. Verifique o e-mail e tente novamente.
            </p>
          )}

          <button
            type="button"
            onClick={handleReset}
            disabled={resetStatus === 'sending' || resetStatus === 'sent' || !resetEmail}
            className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resetStatus === 'sending' ? 'Enviando…' : resetStatus === 'sent' ? 'E-mail enviado ✓' : 'Enviar link de redefinição'}
          </button>

          <button
            type="button"
            onClick={() => { setShowReset(false); setResetStatus('idle'); }}
            className="w-full text-center text-sm text-gray-500 hover:text-brand"
          >
            ← Voltar ao login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <button
              type="button"
              onClick={() => { setResetEmail(getValues('email')); setShowReset(true); }}
              className="text-xs text-gray-400 hover:text-brand"
            >
              Esqueci minha senha
            </button>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Não tem conta?{' '}
        <Link href="/register" className="font-medium text-brand hover:underline">
          Criar conta
        </Link>
      </p>
    </>
  );
}
