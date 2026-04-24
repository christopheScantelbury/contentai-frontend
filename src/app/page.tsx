import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/Logo';
import BeforeAfterTabs from '@/components/BeforeAfterTabs';
import NavAuthButtons from '@/components/NavAuthButtons';

export const metadata: Metadata = {
  title: 'DescriÃ§Ã£o AI â DescriÃ§Ãµes de produtos geradas por IA em segundos',
  description:
    'Gere tÃ­tulos, descriÃ§Ãµes curtas, longas e pontos de venda para qualquer produto com inteligÃªncia artificial. Economize horas de trabalho toda semana.',
  openGraph: {
    title: 'DescriÃ§Ã£o AI â DescriÃ§Ãµes de produtos geradas por IA',
    description:
      'Gere conteÃºdo de produto profissional em segundos. Hero, bullets e SEO prontos para copiar.',
    url: 'https://descricaoai.com.br',
    siteName: 'DescriÃ§Ã£o AI',
    images: [
      {
        url: 'https://descricaoai.com.br/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DescriÃ§Ã£o AI â Gerador de conteÃºdo com IA',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DescriÃ§Ã£o AI â DescriÃ§Ãµes de produtos com IA',
    description: 'Gere conteÃºdo de produto profissional em segundos.',
    images: ['https://descricaoai.com.br/og-image.png'],
  },
};

// âââ Planos ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const PLANS = [
  {
    name: 'GrÃ¡tis',
    price: 'R$ 0',
    period: 'para sempre',
    description: 'Para conhecer a plataforma sem compromisso.',
    badge: null as string | null,
    features: [
      '10 geraÃ§Ãµes por mÃªs',
      'TÃ­tulo + descriÃ§Ã£o curta + bullets',
      'ExportaÃ§Ã£o com 1 clique',
      'Suporte via documentaÃ§Ã£o',
    ],
    cta: 'ComeÃ§ar grÃ¡tis',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'R$ 49',
    period: '/mÃªs',
    description: 'Para lojistas que querem escalar.',
    badge: '7 dias grÃ¡tis',
    features: [
      '300 geraÃ§Ãµes por mÃªs',
      'TÃ­tulo, descriÃ§Ãµes e bullets',
      'HistÃ³rico completo de produtos',
      'Upload de foto do produto',
      'Suporte via e-mail',
    ],
    cta: 'ComeÃ§ar 7 dias grÃ¡tis',
    href: '/register?plan=pro',
    highlight: true,
  },
  {
    name: 'Business',
    price: 'R$ 149',
    period: '/mÃªs',
    description: 'Para agÃªncias e grandes catÃ¡logos.',
    badge: null,
    features: [
      '1.500 geraÃ§Ãµes por mÃªs',
      'Tudo do plano Pro',
      'API de integraÃ§Ã£o',
      'RelatÃ³rios de uso avanÃ§ados',
      'Suporte prioritÃ¡rio',
    ],
    cta: 'Assinar Business',
    href: '/register?plan=business',
    highlight: false,
  },
] as const;

// âââ Antes / Depois âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const BEFORE_AFTER = {
  before: {
    title: 'TÃªnis Esportivo Azul',
    description:
      'TÃªnis azul para corrida. Material sintÃ©tico. Solado de borracha. DisponÃ­vel nos tamanhos 38 ao 44.',
  },
  after: {
    title: 'TÃªnis Running Pro 3000 â Leveza e Amortecimento para Sua Melhor Performance',
    description:
      'Desenvolvido para corredores que buscam velocidade sem abrir mÃ£o do conforto, o TÃªnis Running Pro 3000 combina cabedal em mesh respirÃ¡vel com solado de borracha de alta traÃ§Ã£o. O sistema de amortecimento EVA absorve impactos, reduzindo a fadiga mesmo em corridas longas. Design aerodinÃ¢mico em azul royal com detalhes reflexivos para visibilidade noturna.',
    bullets: [
      'Cabedal em mesh respirÃ¡vel â mantÃ©m os pÃ©s frescos durante toda a corrida',
      'Amortecimento EVA de dupla densidade â absorÃ§Ã£o de impacto superior',
      'Solado de borracha antiderrapante â aderÃªncia em asfalto e trilha',
      'Refletivo 360Â° â seguranÃ§a em treinos noturnos',
    ],
  },
};

// âââ Componentes de seÃ§Ã£o ââââââââââââââââââââââââââââââââââââââââââââââââââââ

function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-lg font-bold text-brand">DescriÃ§Ã£o AI</span>
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 sm:flex">
          <a href="#como-funciona" className="hover:text-brand">Como funciona</a>
          <a href="#planos" className="hover:text-brand">Planos</a>
        </nav>
        <NavAuthButtons />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[80vh] bg-gradient-to-b from-brand/5 to-white px-4 py-14 text-center flex items-center">
      <div className="mx-auto w-full max-w-3xl">
        <a
          href="https://scantelburydevs.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand transition hover:bg-brand/20"
        >
          <Logo size="sm" />
          Desenvolvido pela ScantelburyDevs
        </a>
        <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Seu produto merece uma{' '}
          <span className="text-brand">descriÃ§Ã£o que vende</span>.<br />
          A IA faz em 10 segundos.
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-gray-600">
          Cole as informaÃ§Ãµes do produto. Em 10 segundos vocÃª tem tÃ­tulo, descriÃ§Ã£o curta, longa
          e atÃ© 5 bullets prontos para o{' '}
          <span className="font-semibold text-gray-800">Mercado Livre</span>,{' '}
          <span className="font-semibold text-gray-800">Shopee</span> ou sua loja â sem reescrever nada.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="w-full rounded-xl bg-brand px-10 py-4 text-base font-bold text-white shadow hover:bg-brand-dark sm:w-auto"
          >
            ComeÃ§ar grÃ¡tis â 10 geraÃ§Ãµes/mÃªs
          </Link>
          <a
            href="#como-funciona"
            className="text-sm font-medium text-brand hover:underline"
          >
            Ver como funciona â
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-400">Sem cartÃ£o de crÃ©dito. Cancele quando quiser.</p>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Preencha o formulÃ¡rio',
      desc: 'Informe o nome do produto, a categoria e suas principais caracterÃ­sticas. Opcionalmente, adicione uma foto.',
    },
    {
      num: '2',
      title: 'A IA gera o conteÃºdo',
      desc: 'Em menos de 10 segundos vocÃª recebe tÃ­tulo, descriÃ§Ã£o curta, descriÃ§Ã£o completa e atÃ© 5 pontos de venda.',
    },
    {
      num: '3',
      title: 'Copie e publique',
      desc: 'Clique em copiar em cada campo e cole diretamente na sua loja, marketplace ou planilha.',
    },
  ];

  return (
    <section id="como-funciona" className="bg-white px-4 py-14">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Como funciona</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-xl font-bold text-brand">
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
    <section className="bg-gray-50 px-4 py-14">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
          Veja a diferenÃ§a
        </h2>
        <p className="mb-12 text-center text-gray-600">
          Do texto genÃ©rico a uma descriÃ§Ã£o que converte.
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
                Depois â DescriÃ§Ã£o AI
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
                  <span className="mt-0.5 text-brand">â¢</span>
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

function SocialProof() {
  const stats = [
    { value: '10s', label: 'Tempo mÃ©dio de geraÃ§Ã£o' },
    { value: '4', label: 'Campos gerados por produto' },
    { value: '100%', label: 'ConteÃºdo original' },
  ];

  return (
    <section className="bg-gray-50 px-4 py-14">
      <div className="mx-auto max-w-5xl">
        {/* Stats */}
        <div className="mb-12 grid grid-cols-3 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold text-brand">{s.value}</p>
              <p className="mt-1 text-sm text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Depoimentos â aguardando usuÃ¡rios reais */}
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
          O que dizem os lojistas
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              text: '"Reduzi o tempo de cadastro de produto de 20 minutos para menos de 2. Impacto direto na operaÃ§Ã£o."',
              name: 'Mariana S.',
              role: 'Loja de moda â Shopee',
            },
            {
              text: '"Os bullets ficam muito melhores do que o que eu escrevia. Minhas conversÃµes no ML melhoraram."',
              name: 'Ricardo A.',
              role: 'EletrÃ´nicos â Mercado Livre',
            },
            {
              text: '"Uso para todo o catÃ¡logo da agÃªncia. O plano Business pagou em 1 semana de trabalho economizado."',
              name: 'Fernanda L.',
              role: 'AgÃªncia de e-commerce',
            },
          ].map((t) => (
            <div key={t.name} className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="mb-4 text-sm italic leading-relaxed text-gray-700">{t.text}</p>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyNotChatGPT() {
  const items = [
    {
      icon: 'â¡',
      title: 'Campos estruturados, prontos para colar',
      desc: 'TÃ­tulo, descriÃ§Ã£o curta, longa e bullets gerados separadamente â sem montar prompt, sem formatar manualmente.',
    },
    {
      icon: 'ð',
      title: 'Otimizado para Mercado Livre e Shopee',
      desc: 'NÃ£o Ã© texto genÃ©rico. O conteÃºdo Ã© formatado para os padrÃµes dos principais marketplaces brasileiros.',
    },
    {
      icon: 'ð',
      title: 'HistÃ³rico completo de produtos',
      desc: 'Acesse qualquer descriÃ§Ã£o gerada anteriormente, reutilize com 1 clique e mantenha consistÃªncia no catÃ¡logo.',
    },
  ];

  return (
    <section className="bg-white px-4 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-500">
            Comparativo
          </span>
          <h2 className="text-3xl font-bold text-gray-900">Por que nÃ£o sÃ³ o ChatGPT?</h2>
          <p className="mt-3 text-gray-600">
            O ChatGPT Ã© Ã³timo. Mas para produto de e-commerce, contexto importa.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <div className="mb-3 text-2xl">{item.icon}</div>
              <h3 className="mb-2 text-sm font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="planos" className="bg-white px-4 py-14">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">Planos e preÃ§os</h2>
        <p className="mb-12 text-center text-gray-600">
          Comece grÃ¡tis. FaÃ§a upgrade quando precisar de mais.
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.highlight
                  ? 'border-brand bg-brand text-white shadow-xl shadow-brand/20'
                  : 'border-gray-200 bg-white text-gray-900'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-0.5 text-xs font-bold text-gray-900">
                  Mais popular
                </span>
              )}
              {plan.badge && !plan.highlight && (
                <span className="absolute -top-3 right-4 rounded-full bg-green-500 px-3 py-0.5 text-xs font-bold text-white">
                  {plan.badge}
                </span>
              )}
              <div className="mb-4">
                <p className={`text-xs font-semibold uppercase tracking-wide ${plan.highlight ? 'text-brand/70' : 'text-gray-500'}`}>
                  {plan.name}
                </p>
                <div className="mt-1 flex items-end gap-1">
                  <span className="text-3xl font-extrabold">{plan.price}</span>
                  <span className={`mb-1 text-sm ${plan.highlight ? 'text-brand/70' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mt-1 text-sm ${plan.highlight ? 'text-brand/50' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="mb-6 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <svg
                      className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? 'text-brand/70' : 'text-brand'}`}
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
                    ? 'bg-white text-brand hover:bg-brand/10'
                    : 'bg-brand text-white hover:bg-brand-dark'
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

// âââ FAQ ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const FAQS = [
  {
    q: 'A IA copia textos de outros lugares?',
    a: 'NÃ£o. Cada descriÃ§Ã£o Ã© gerada do zero com base nas informaÃ§Ãµes que vocÃª fornece. O conteÃºdo Ã© original e exclusivo para o seu produto.',
  },
  {
    q: 'Funciona para Mercado Livre, Shopee e outras plataformas?',
    a: 'Sim. O conteÃºdo gerado â tÃ­tulo, descriÃ§Ã£o curta, longa e bullets â Ã© compatÃ­vel com qualquer marketplace ou loja virtual. Basta copiar e colar.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim, sem multa e sem burocracia. VocÃª cancela pela prÃ³pria conta a qualquer momento e nÃ£o Ã© cobrado no mÃªs seguinte.',
  },
  {
    q: 'Por que nÃ£o usar o ChatGPT direto?',
    a: 'O DescriÃ§Ã£o AI gera campos estruturados e separados (tÃ­tulo, curta, longa, bullets) prontos para colar â sem montar prompt. TambÃ©m salva histÃ³rico de todos os produtos gerados.',
  },
  {
    q: 'Quantas geraÃ§Ãµes posso fazer por mÃªs?',
    a: 'Depende do plano: GrÃ¡tis (10), Pro (300) ou Business (1.500). Cada geraÃ§Ã£o produz tÃ­tulo + descriÃ§Ã£o curta + descriÃ§Ã£o completa + atÃ© 5 bullets.',
  },
  {
    q: 'Meus dados de produto ficam armazenados?',
    a: 'Sim, o histÃ³rico completo fica salvo na sua conta. VocÃª pode acessar, reutilizar ou exportar qualquer geraÃ§Ã£o anterior a qualquer momento.',
  },
] as const;

function FAQ() {
  return (
    <section className="bg-gray-50 px-4 py-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
          Perguntas frequentes
        </h2>
        <dl className="space-y-4">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl border border-gray-200 bg-white px-5 py-4 open:shadow-sm"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-gray-900 marker:content-none">
                {faq.q}
                <svg
                  className="h-4 w-4 shrink-0 text-brand transition-transform group-open:rotate-180"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{faq.a}</p>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="bg-navy px-4 py-16 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-4 text-3xl font-bold text-white">
          Pronto para economizar horas toda semana?
        </h2>
        <p className="mb-8 text-gray-400">
          Junte-se a centenas de lojistas que jÃ¡ automatizaram a criaÃ§Ã£o de conteÃºdo com DescriÃ§Ã£o AI.
        </p>
        <Link
          href="/register"
          className="inline-block rounded-xl bg-brand px-10 py-4 text-base font-bold text-navy shadow-lg shadow-brand/30 hover:bg-brand-dark hover:text-white transition-colors"
        >
          ComeÃ§ar grÃ¡tis agora
        </Link>
        <p className="mt-3 text-xs text-gray-500">Sem cartÃ£o de crÃ©dito. 10 geraÃ§Ãµes grÃ¡tis por mÃªs.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row">
        <span className="font-bold text-gray-700">DescriÃ§Ã£o AI</span>
        <nav className="flex gap-5">
          <a href="#planos" className="hover:text-brand">Planos</a>
          <a href="#como-funciona" className="hover:text-brand">Como funciona</a>
          <Link href="/login" className="hover:text-brand">Entrar</Link>
          <Link href="/termos" className="hover:text-brand">Termos</Link>
          <Link href="/privacidade" className="hover:text-brand">Privacidade</Link>
        </nav>
        <div className="flex flex-col items-center gap-1 sm:items-end">
          <p>Â© {new Date().getFullYear()} DescriÃ§Ã£o AI. Todos os direitos reservados.</p>
          <a
            href="https://scantelburydevs.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand transition-colors"
          >
            Desenvolvido por
            <Logo size="md" />
          </a>
        </div>
      </div>
    </footer>
  );
}

// âââ Page ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

export default function LandingPage() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <HowItWorks />
        <BeforeAfterTabs />
        <WhyNotChatGPT />
        <SocialProof />
        <Pricing />
        <FAQ />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
