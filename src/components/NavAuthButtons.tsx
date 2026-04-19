'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function NavAuthButtons() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  // Loading state — render placeholder to avoid layout shift
  if (loggedIn === null) {
    return <div className="h-8 w-48" />;
  }

  if (loggedIn) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-brand"
        >
          Sair
        </button>
        <Link
          href="/dashboard"
          className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Acessar painel →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-brand"
      >
        Entrar
      </Link>
      <Link
        href="/register"
        className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Começar grátis
      </Link>
    </div>
  );
}
