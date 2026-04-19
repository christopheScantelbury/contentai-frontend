import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termos de Uso — Descrição AI',
  description: 'Termos e condições de uso da plataforma Descrição AI.',
};

export default function TermosPage() {
  const updated = '19 de abril de 2026';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-lg font-bold text-brand">Descrição AI</Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-brand">← Voltar ao início</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Termos de Uso</h1>
        <p className="mb-10 text-sm text-gray-500">Última atualização: {updated}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou utilizar a plataforma Descrição AI (<strong>descricaoai.com.br</strong>), operada pela
              ScantelburyDevs, você concorda com estes Termos de Uso. Caso não concorde com qualquer
              disposição, não utilize o serviço.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">2. Descrição do Serviço</h2>
            <p>
              O Descrição AI é uma plataforma SaaS de geração de conteúdo para produtos por meio de
              inteligência artificial. O serviço permite gerar títulos, descrições curtas, descrições
              longas e pontos de venda (bullets) para produtos de e-commerce, marketplaces e lojas virtuais.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">3. Cadastro e Conta</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Você deve fornecer informações verdadeiras no cadastro.</li>
              <li>É responsável por manter a confidencialidade de sua senha.</li>
              <li>Cada conta é pessoal e intransferível.</li>
              <li>Você deve ter pelo menos 18 anos para criar uma conta.</li>
              <li>Reservamo-nos o direito de suspender contas que violem estes termos.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">4. Planos e Pagamento</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>O plano Grátis oferece 10 gerações por mês, sem cobrança.</li>
              <li>Os planos pagos são cobrados mensalmente via cartão de crédito.</li>
              <li>O cancelamento pode ser feito a qualquer momento; o acesso permanece até o fim do período pago.</li>
              <li>Não há reembolso por período parcial de uso.</li>
              <li>Os preços podem ser alterados com aviso prévio de 30 dias por e-mail.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">5. Uso Aceitável</h2>
            <p>É proibido utilizar a plataforma para:</p>
            <ul className="list-disc space-y-2 pl-5 mt-2">
              <li>Gerar conteúdo ilegal, enganoso, difamatório ou que viole direitos de terceiros.</li>
              <li>Realizar engenharia reversa ou tentativas de acesso não autorizado à API.</li>
              <li>Revender ou redistribuir o serviço sem autorização expressa.</li>
              <li>Uso automatizado que exceda os limites do plano contratado.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">6. Propriedade do Conteúdo Gerado</h2>
            <p>
              O conteúdo gerado pela plataforma pertence ao usuário que o solicitou. A ScantelburyDevs
              não reivindica direitos sobre os textos produzidos. Você é responsável pelo uso do conteúdo
              gerado, incluindo sua adequação ao produto anunciado.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">7. Disponibilidade e Limitação de Responsabilidade</h2>
            <p>
              Buscamos manter o serviço disponível 99% do tempo, mas não garantimos funcionamento
              ininterrupto. Não somos responsáveis por danos indiretos, perda de receita ou perda de
              dados decorrentes do uso ou indisponibilidade da plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">8. Alterações nos Termos</h2>
            <p>
              Podemos atualizar estes termos a qualquer momento. Alterações relevantes serão comunicadas
              por e-mail com antecedência de 15 dias. O uso continuado após a vigência das alterações
              constitui aceitação.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">9. Lei Aplicável</h2>
            <p>
              Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de
              São Paulo/SP para dirimir quaisquer controvérsias.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">10. Contato</h2>
            <p>
              Para dúvidas sobre estes Termos:{' '}
              <a href="mailto:contato@descricaoai.com.br" className="text-brand hover:underline">
                contato@descricaoai.com.br
              </a>
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 px-4 py-6 text-center text-xs text-gray-400">
        <Link href="/privacidade" className="hover:text-brand">Política de Privacidade</Link>
        {' · '}
        <Link href="/" className="hover:text-brand">Descrição AI</Link>
      </footer>
    </div>
  );
}
