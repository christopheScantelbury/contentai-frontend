'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function ConfirmarEmailPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleResend() {
    setStatus('sending');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
      setStatus('error');
      return;
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
      options: { emailRedirectTo: 'https://www.descricaoai.com.br/dashboard' },
    });

    setStatus(error ? 'error' : 'sent');
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block text-2xl font-bold text-brand hover:opacity-80">
            Descrição AI
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-5xl">📧</div>
          <h1 className="mb-2 text-xl font-bold text-gray-900">Confirme seu e-mail</h1>
          <p className="mb-6 text-sm text-gray-500 leading-relaxed">
            Para acessar o painel, você precisa confirmar seu e-mail.
            Verifique sua caixa de entrada e clique no link enviado.
          </p>

          {status === 'sent' && (
            <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              E-mail reenviado! Verifique sua caixa de entrada.
            </div>
          )}
          {status === 'error' && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              Erro ao reenviar. Tente novamente.
            </div>
          )}

          <button
            onClick={handleResend}
            disabled={status === 'sending' || status === 'sent'}
            className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'sending' ? 'Enviando…' : status === 'sent' ? 'E-mail enviado ✓' : 'Reenviar e-mail de confirmação'}
          </button>

          <p className="mt-4 text-xs text-gray-400">
            Não é você?{' '}
            <button onClick={handleLogout} className="text-brand hover:underline">
              Sair e usar outro e-mail
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
