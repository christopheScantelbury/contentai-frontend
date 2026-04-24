'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if already on the login page
    if (pathname === '/admin/login') return;
    const secret = sessionStorage.getItem('admin_secret');
    if (!secret) {
      router.replace('/admin/login');
    }
  }, [router, pathname]);

  const isLoginPage = pathname === '/admin/login' || pathname === '/admin';

  function handleLogout() {
    sessionStorage.removeItem('admin_secret');
    router.replace('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoginPage && (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900 mr-4 text-sm tracking-wide uppercase">
                  Admin
                </span>
                <Link
                  href="/admin/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Usuários
                </Link>
                <Link
                  href="/admin/quality"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Qualidade
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </nav>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
