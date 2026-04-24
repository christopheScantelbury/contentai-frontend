'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminSecret() {
  const router = useRouter();
  const [secret, setSecret] = useState<string | null>(null);

  useEffect(() => {
    const s = sessionStorage.getItem('admin_secret');
    if (!s) {
      router.replace('/admin/login');
      return;
    }
    setSecret(s);
  }, [router]);

  return secret;
}
