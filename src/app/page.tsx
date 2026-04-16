import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ContentAI — Descrições de produtos geradas por IA em segundos',
  description:
    'Gere títulos, descrições curtas, longas e pontos de venda para qualquer produto com inteligência artificial. Economize horas de trabalho toda semana.',
  openGraph: {
    title: 'ContentAI — Descrições de produtos geradas por IA',
    description:
      'Gere conteúdo de produto profissional em segundos. Hero, bullets e SEO prontos para copiar.',
    url: 'https://contentai.vercel.app',
    siteName: 'ContentAI',
    images: [
      {
        url: 'https://contentai.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ContentAI — Gerador de conteúdo com IA',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContentAI — Descrições de produtos com IA',
    description: 'Gere conteúdo de produto profissional em segundos.',
    images: ['https://contentai.vercel.app/og-image.png'],
  },
};

// ─── Planos ────────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    period: 'para sempre',
    description: 'Perfeito para experimentar a plataforma.',
    credits: 10,
    features: [
      '10 gerações por mês',
      'Título + descrição curta',
      'Exportação manual (copiar)',
      'Suporte via documentação',
    ],
    cta: 'Começar grátis',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'R$ 49',
    period: '/mês',
    description: 'Para lojistas e criadores de conteúdo.',
    credits: 300,
    features: [
      '300 gerações por mês',
      'Título, descrições e bullets',
      'Histórico completo',
      'Upload de foto do produto',
      'Suporte via e-mail',
    ],
    cta: 'Assinar Pro',
    href: '/register?plan=pro',
    highlight: true,
  },
  {
    name: 'Business',
    price: 'R$ 149',
    period: '/mês',
    description: 'Para agências e grandes catálogos.',
    credits: 1500,
    features: [
      '1 500 gerações por mês',
      'Tudo do plano Pro',
      'API de integração',
      'Relatórios de uso avançados',
      'Suporte prioritário',
    ],
    cta: 'Falar com vendas',
    href: 'mailto:vendas@contentai.com.br',
    highlight: false,
  },
] as const;

// ─── Antes / Depois ─────────────────────────────────────────────────────────

const BEFORE_AFTER = {
  before: {
    title: 'Tênis Esportivo Azul',
    description:
      'Tênis azul para corrida. Material sintético. Solado de borracha. Disponível nos tamanhos 38 ao 44.',
  },
  after: {
    title: 'Tênis Running Pro 3000 — Leveza e Amortecimento para Sua Melhor Performance',
    description:
      'Desenvolvido para corredores que buscam velocidade sem abrir mão do conforto, o Tênis Running Pro 3000 combina cabedal em mesh respirável com solado de borracha de alta tração. O sistema de amortecimento EVA absorve impactos, reduzindo a fadiga mesmo em corridas longas. Design aerodinâmico em azul royal com detalhes reflexivos para visibilidade noturna.',
    bullets: [
      'Cabedal em mesh respirável — mantém os pés frescos durante toda a corrida',
      'Amortecimento EVA de dupla densidade — absorção de impacto superior',
      'Solado de borracha antiderrapante — aderência em asfalto e trilha',
      'Refletivo 360° — segurança em treinos noturnos',
    ],
  },
};

// ─── Componentes de seção ────────────────────────────────────────────────────

function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-lg font-bold text-indigo-600">ContentAI</span>
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 sm:flex">
          <a href="#como-funciona" className="hover:text-indigo-600">Como funciona</a>
          <a href="#planos" className="hover:text-indigo-600">Planos</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Começar grátis
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white px-4 py-20 text-center">
      <div className="mx-auto max-w-3xl">
        <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          Powered by Claude AI
        </span>
        <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Descrições de produtos{' '}
          <span className="text-indigo-600">irresistíveis</span>,<br />
          em segundos
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-gray-600">
          Cole o nome, categoria e características do produto. A IA gera título, descrição curta,
          descrição longa e pontos de venda prontos para publicar.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="w-full rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-bold text-white shadow hover:bg-indigo-700 sm:w-auto"
          >
            Começar grátis — 10 gerações/mês
          </Link>
          <a
            href="#como-funciona"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Ver como funciona ↓
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-400">Sem cartão de crédito. Cancele quando quiser.</p>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Preencha o formulário',
      desc: 'Informe o nome do produto, a categoria e suas principais características. Opcionalmente, adicione uma foto.',
    },
    {
      num: '2',
      title: 'A IA gera o conteúdo',
      desc: 'Em menos de 10 segundos você recebe título, descrição curta, descrição completa e até 5 pontos de venda.',
    },
    {
      num: '3',
      title: 'Copie e publique',
      desc: 'Clique em copiar em cada campo e cole diretamente na sua loja, marketplace ou planilha.',
    },
  ];

  return (
    <section id="como-funciona" className="bg-white px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Como funciona</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                {step.num}
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfter() {
  return (
    <section className="bg-gray-50 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
          Veja a diferença
        </h2>
        <p className="mb-12 text-center text-gray-600">
          Do texto genérico a uma descrição que converte.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Antes */}
          <div className="rounded-2xl border border-red-100 bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                Antes
              </span>
            </div>
            <p className="mb-2 text-base font-semibold text-gray-900">
              {BEFORE_AFTER.before.title}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {BEFORE_AFTER.before.description}
            </p>
          </div>

          {/* Depois */}
          <div className="rounded-2xl border border-green-100 bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                Depois — ContentAI
              </span>
            </div>
            <p className="mb-2 text-base font-semibold text-gray-900">
              {BEFORE_AFTER.after.title}
            </p>
            <p className="mb-3 text-sm text-gray-700 leading-relaxed">
              {BEFORE_AFTER.after.description}
            </p>
            <ul className="space-y-1">
              {BEFORE_AFTER.after.bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="mt-0.5 text-indigo-500">•</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="planos" className="bg-white px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">Planos e preços</h2>
        <p className="mb-12 text-center text-gray-600">
          Comece grátis. Faça upgrade quando precisar de mais.
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.highlight
                  ? 'border-indigo-500 bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                  : 'border-gray-200 bg-white text-gray-900'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-0.5 text-xs font-bold text-gray-900">
                  Mais popular
                </span>
              )}
              <div className="mb-4">
                <p className={`text-xs font-semibold uppercase tracking-wide ${plan.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {plan.name}
                </p>
                <div className="mt-1 flex items-end gap-1">
                  <span className="text-3xl font-extrabold">{plan.price}</span>
                  <span className={`mb-1 text-sm ${plan.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mt-1 text-sm ${plan.highlight ? 'text-indigo-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="mb-6 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <svg
                      className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? 'text-indigo-200' : 'text-indigo-500'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full rounded-xl py-2.5 text-center text-sm font-bold transition ${
                  plan.highlight
                    ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="bg-indigo-600 px-4 py-16 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-4 text-3xl font-bold text-white">
          Pronto para economizar horas toda semana?
        </h2>
        <p className="mb-8 text-indigo-200">
          Junte-se a centenas de lojistas que já automatizaram a criação de conteúdo com ContentAI.
        </p>
        <Link
          href="/register"
          className="inline-block rounded-xl bg-white px-8 py-3.5 text-base font-bold text-indigo-600 shadow hover:bg-indigo-50"
        >
          Começar grátis agora
        </Link>
        <p className="mt-3 text-xs text-indigo-300">Sem cartão de crédito. 10 gerações grátis por mês.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row">
        <span className="font-bold text-gray-700">ContentAI</span>
        <nav className="flex gap-5">
          <a href="#planos" className="hover:text-indigo-600">Planos</a>
          <a href="#como-funciona" className="hover:text-indigo-600">Como funciona</a>
          <Link href="/login" className="hover:text-indigo-600">Entrar</Link>
        </nav>
        <p>© {new Date().getFullYear()} ContentAI. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <HowItWorks />
        <BeforeAfter />
        <Pricing />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
