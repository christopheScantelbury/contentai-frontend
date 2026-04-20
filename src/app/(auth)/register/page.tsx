'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

const schema = z
  .object({
    email:           z.string().email('E-mail inválido'),
    password:        z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message:  'As senhas não coincidem',
    path:     ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError,   setServerError]   = useState('');
  const [emailSent,     setEmailSent]     = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError('');
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email:    data.email,
      password: data.password,
      options:  { emailRedirectTo: `${window.location.origin}/dashboard` },
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    setEmailSent(true);
  }

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 text-4xl">📧</div>
          <h1 className="mb-2 text-xl font-bold">Confirme seu e-mail</h1>
          <p className="text-sm text-gray-600">
            Enviamos um link de confirmação para o seu e-mail. Clique nele para
            ativar sua conta.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm font-medium text-brand hover:underline"
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block text-2xl font-bold text-brand hover:opacity-80">
            Descrição AI
          </Link>
        </div>
        <h1 className="mb-6 text-center text-2xl font-bold">Criar conta</h1>

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
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
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
            {isSubmitting ? 'Criando conta…' : 'Criar conta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem conta?{' '}
          <Link href="/login" className="font-medium text-brand hover:underline">
            Entrar
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-gray-400">
          Ao criar uma conta você concorda com os{' '}
          <Link href="/termos" className="underline hover:text-brand">Termos de Uso</Link>
          {' '}e a{' '}
          <Link href="/privacidade" className="underline hover:text-brand">Política de Privacidade</Link>.
        </p>
      </div>
    </div>
  );
}
