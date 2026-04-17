import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Descrição AI — Gerador de conteúdo para produtos',
  description:
    'Gere títulos, descrições e bullets de venda para seus produtos com inteligência artificial. Desenvolvido pela ScantelburyDevs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
