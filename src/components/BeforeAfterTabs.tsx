'use client';

import { useState } from 'react';

const EXAMPLES = [
  {
    label: '👟 Moda',
    before: {
      title: 'Tênis Esportivo Azul',
      description: 'Tênis azul para corrida. Material sintético. Solado de borracha. Disponível nos tamanhos 38 ao 44.',
    },
    after: {
      title: 'Tênis Running Pro 3000 — Leveza e Amortecimento para Sua Melhor Performance',
      description:
        'Desenvolvido para corredores que buscam velocidade sem abrir mão do conforto, o Tênis Running Pro 3000 combina cabedal em mesh respirável com solado de alta tração. O amortecimento EVA absorve impactos, reduzindo a fadiga em corridas longas.',
      bullets: [
        'Cabedal em mesh respirável — pés frescos em qualquer ritmo',
        'Amortecimento EVA de dupla densidade — impacto absorvido',
        'Solado antiderrapante — aderência em asfalto e trilha',
        'Refletivo 360° — segurança em treinos noturnos',
      ],
    },
  },
  {
    label: '📱 Eletrônicos',
    before: {
      title: 'Fone Bluetooth Preto',
      description: 'Fone sem fio. Bateria de 20h. Conexão Bluetooth 5.0. Cor preta.',
    },
    after: {
      title: 'Fone Bluetooth AirSound X5 — Som Imersivo com 30h de Bateria e Cancelamento de Ruído',
      description:
        'O AirSound X5 entrega graves potentes e médios nítidos com drivers de 40mm e tecnologia de cancelamento ativo de ruído. Ideal para home office, academia e viagens longas — carrega 100% em 1h e dura até 30 horas.',
      bullets: [
        'Cancelamento ativo de ruído — foco total sem distrações',
        'Bateria de 30h — semanas sem precisar carregar',
        'Bluetooth 5.0 — conexão estável até 15 metros',
        'Almofadas em couro vegano — conforto em uso prolongado',
      ],
    },
  },
  {
    label: '🍫 Alimentos',
    before: {
      title: 'Granola Natural 400g',
      description: 'Granola com aveia, mel e frutas secas. Embalagem de 400g. Sem conservantes.',
    },
    after: {
      title: 'Granola Artesanal Golden Mix 400g — Crocante, Natural e Sem Adição de Açúcar',
      description:
        'Feita com aveia integral tostada, mel de abelha silvestre, castanha-do-pará e cranberry desidratado, a Golden Mix é a escolha certa para um café da manhã nutritivo. Sem conservantes, corantes ou açúcar adicionado — só o que a natureza oferece.',
      bullets: [
        'Sem açúcar adicionado — adoçada naturalmente com mel',
        'Rica em fibras — auxilia o trânsito intestinal',
        'Ingredientes rastreados — origem certificada',
        'Embalagem resealable — mantém a crocância por mais tempo',
      ],
    },
  },
] as const;

export default function BeforeAfterTabs() {
  const [active, setActive] = useState(0);
  const ex = EXAMPLES[active];

  return (
    <section className="bg-gray-50 px-4 py-14">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-3 text-center text-3xl font-bold text-gray-900">Veja a diferença</h2>
        <p className="mb-8 text-center text-gray-600">Do texto genérico a uma descrição que converte — gerado em menos de 10 segundos.</p>

        {/* Tabs */}
        <div className="mb-6 flex justify-center gap-2">
          {EXAMPLES.map((e, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                i === active
                  ? 'bg-brand text-white shadow'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Antes */}
          <div className="rounded-2xl border border-red-100 bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">Antes</span>
              <span className="text-xs text-gray-400">Descrição manual comum</span>
            </div>
            <p className="mb-2 text-sm font-semibold text-gray-900">{ex.before.title}</p>
            <p className="text-sm leading-relaxed text-gray-500">{ex.before.description}</p>
          </div>

          {/* Depois */}
          <div className="rounded-2xl border border-green-100 bg-white p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                Depois — Descrição AI
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <svg className="h-3 w-3 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                gerado em ~8s
              </span>
            </div>
            <p className="mb-2 text-sm font-semibold text-gray-900">{ex.after.title}</p>
            <p className="mb-3 text-sm leading-relaxed text-gray-700">{ex.after.description}</p>
            <ul className="space-y-1">
              {ex.after.bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="mt-0.5 text-brand">•</span>
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
