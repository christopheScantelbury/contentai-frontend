'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function useAdminSecret() {
  const router = useRouter();
  const [secret, setSecret] = useState<string | null>(null);

  useEffect(() => {
    const s = getCookie('admin_token');
    if (!s) {
      router.replace('/admin/login');
      return;
    }
    setSecret(s);
  }, [router]);

  return secret;
}
