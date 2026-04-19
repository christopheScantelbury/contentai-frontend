import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade — Descrição AI',
  description: 'Como coletamos, usamos e protegemos seus dados — em conformidade com a LGPD.',
};

export default function PrivacidadePage() {
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
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Política de Privacidade</h1>
        <p className="mb-2 text-sm text-gray-500">Última atualização: {updated}</p>
        <p className="mb-10 text-sm text-gray-500">
          Em conformidade com a{' '}
          <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
        </p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">1. Controlador dos Dados</h2>
            <p>
              Os seus dados são controlados pela <strong>ScantelburyDevs</strong>, operadora da
              plataforma Descrição AI (descricaoai.com.br).{' '}
              Contato do DPO: <a href="mailto:privacidade@descricaoai.com.br" className="text-brand hover:underline">
                privacidade@descricaoai.com.br
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">2. Dados que Coletamos</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Dado</th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Finalidade</th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Base Legal (LGPD)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['E-mail', 'Autenticação e comunicação', 'Execução de contrato (Art. 7º, V)'],
                    ['Dados de uso (gerações)', 'Funcionamento do serviço e histórico', 'Execução de contrato (Art. 7º, V)'],
                    ['Dados de pagamento', 'Processamento de assinatura via Stripe', 'Execução de contrato (Art. 7º, V)'],
                    ['Logs de acesso (IP, data/hora)', 'Segurança e cumprimento legal', 'Obrigação legal (Art. 7º, II)'],
                    ['Cookies de sessão', 'Manter sessão autenticada', 'Legítimo interesse (Art. 7º, IX)'],
                  ].map(([dado, finalidade, base], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 px-3 py-2 font-medium">{dado}</td>
                      <td className="border border-gray-200 px-3 py-2">{finalidade}</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-500">{base}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">3. Compartilhamento de Dados</h2>
            <p>Seus dados são compartilhados apenas com os seguintes fornecedores essenciais:</p>
            <ul className="list-disc space-y-2 pl-5 mt-2">
              <li><strong>Supabase</strong> — autenticação e banco de dados (servidores no Brasil/EUA)</li>
              <li><strong>Stripe</strong> — processamento de pagamentos</li>
              <li><strong>Anthropic</strong> — geração de conteúdo por IA (sem armazenar dados do usuário)</li>
              <li><strong>Railway / Vercel</strong> — hospedagem da plataforma</li>
            </ul>
            <p className="mt-3">
              Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">4. Seus Direitos (LGPD Art. 18)</h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc space-y-2 pl-5 mt-2">
              <li><strong>Acesso</strong> — solicitar quais dados temos sobre você</li>
              <li><strong>Correção</strong> — corrigir dados incompletos ou incorretos</li>
              <li><strong>Exclusão</strong> — solicitar a exclusão dos seus dados pessoais</li>
              <li><strong>Portabilidade</strong> — receber seus dados em formato estruturado</li>
              <li><strong>Revogação do consentimento</strong> — a qualquer momento</li>
              <li><strong>Oposição</strong> — contestar tratamento baseado em legítimo interesse</li>
            </ul>
            <p className="mt-3">
              Para exercer seus direitos: <a href="mailto:privacidade@descricaoai.com.br" className="text-brand hover:underline">
                privacidade@descricaoai.com.br
              </a>. Respondemos em até 15 dias úteis.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">5. Retenção de Dados</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Dados da conta: mantidos enquanto a conta estiver ativa.</li>
              <li>Histórico de gerações: mantido por 12 meses após o último acesso.</li>
              <li>Logs de acesso: 6 meses (obrigação legal — Marco Civil da Internet).</li>
              <li>Após cancelamento: dados excluídos em até 90 dias.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">6. Cookies</h2>
            <p>
              Utilizamos apenas cookies essenciais para autenticação (sessão). Não utilizamos cookies
              de rastreamento ou publicidade de terceiros.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">7. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados: HTTPS em todas
              as comunicações, senhas com hash bcrypt, acesso restrito ao banco de dados e revisões
              periódicas de segurança.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">8. Menores de Idade</h2>
            <p>
              O serviço não é destinado a menores de 18 anos. Não coletamos intencionalmente dados
              de menores. Caso identifique dados de menor em nossa base, entre em contato para
              exclusão imediata.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">9. Alterações nesta Política</h2>
            <p>
              Atualizações serão comunicadas por e-mail e publicadas nesta página com a data de revisão.
              O uso continuado após as alterações constitui aceitação.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">10. Contato e ANPD</h2>
            <p>
              Dúvidas ou reclamações:{' '}
              <a href="mailto:privacidade@descricaoai.com.br" className="text-brand hover:underline">
                privacidade@descricaoai.com.br
              </a>.
              Você também pode registrar reclamação junto à{' '}
              <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                ANPD (Autoridade Nacional de Proteção de Dados)
              </a>.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-gray-100 px-4 py-6 text-center text-xs text-gray-400">
        <Link href="/termos" className="hover:text-brand">Termos de Uso</Link>
        {' · '}
        <Link href="/" className="hover:text-brand">Descrição AI</Link>
      </footer>
    </div>
  );
}
