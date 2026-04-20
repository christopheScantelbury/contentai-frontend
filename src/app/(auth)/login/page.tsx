import { Suspense } from 'react';
import Link from 'next/link';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block text-2xl font-bold text-brand hover:opacity-80">
            Descrição AI
          </Link>
        </div>
        <h1 className="mb-6 text-center text-2xl font-bold">Entrar</h1>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
