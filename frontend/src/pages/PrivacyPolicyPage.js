import React from 'react';
// import { useTranslation } from 'react-i18next';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const PrivacyPolicyPage = () => {
  // const { t } = useTranslation();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <ShieldCheckIcon className="h-12 w-12 text-primary-500 dark:text-primary-400 mx-auto" />
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Política de Privacidade
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
            Última atualização: 08 de junho de 2025
          </p>
        </div>

        <div className="mt-12 prose prose-primary dark:prose-invert mx-auto">
          <h2>1. Introdução</h2>
          <p>
            A Doc.AI ("nós", "nosso" ou "empresa") está comprometida em proteger sua privacidade e seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - "LGPD").
          </p>
          <p>
            Ao utilizar nossos serviços, você concorda com as práticas descritas nesta Política de Privacidade. Recomendamos a leitura atenta deste documento.
          </p>

          <h2>2. Definições</h2>
          <p>Para os fins desta Política de Privacidade, consideram-se:</p>
          <ul>
            <li><strong>Dados Pessoais:</strong> informação relacionada a pessoa natural identificada ou identificável.</li>
            <li><strong>Tratamento:</strong> toda operação realizada com dados pessoais, como coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração.</li>
            <li><strong>Titular:</strong> pessoa natural a quem se referem os dados pessoais que são objeto de tratamento.</li>
            <li><strong>Controlador:</strong> pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais.</li>
          </ul>

          <h2>3. Papéis e Responsabilidades</h2>
          <p>
            No contexto desta plataforma, a Doc.AI atua como <strong>Controladora</strong> dos dados pessoais, conforme definido no Art. 5º, VI da LGPD. Isso significa que somos responsáveis pelas decisões referentes ao tratamento dos seus dados pessoais.
          </p>
          <p>
            Você, como usuário da plataforma, é o <strong>Titular dos Dados</strong>, conforme definido no Art. 5º, V da LGPD, e possui direitos específicos em relação aos seus dados pessoais, que serão detalhados nesta política.
          </p>

          <h2>4. Dados Pessoais que Coletamos</h2>
          <p>Podemos coletar os seguintes tipos de dados pessoais:</p>
          <ul>
            <li><strong>Dados de cadastro:</strong> nome completo, e-mail, senha, etc.</li>
            <li><strong>Dados de documentos:</strong> informações contidas nos documentos que você faz upload na plataforma.</li>
            <li><strong>Dados de uso:</strong> informações sobre como você utiliza nossos serviços, incluindo logs de acesso, endereço IP, dispositivo utilizado, etc.</li>
            <li><strong>Dados de preferências:</strong> configurações de conta, preferências de notificação, etc.</li>
          </ul>

          <h2>5. Base Legal para o Tratamento de Dados</h2>
          <p>
            Tratamos seus dados pessoais com base nas seguintes hipóteses legais previstas no Art. 7º da LGPD:
          </p>
          <ul>
            <li><strong>Consentimento (Art. 7º, I):</strong> quando você concorda expressamente com o tratamento de seus dados para finalidades específicas.</li>
            <li><strong>Execução de Contrato (Art. 7º, V):</strong> quando o tratamento é necessário para a execução de contrato do qual você é parte.</li>
            <li><strong>Legítimo Interesse (Art. 7º, IX):</strong> quando o tratamento é necessário para atender aos interesses legítimos da Doc.AI, respeitando seus direitos e liberdades fundamentais.</li>
            <li><strong>Cumprimento de Obrigação Legal (Art. 7º, II):</strong> quando o tratamento é necessário para cumprir uma obrigação legal ou regulatória.</li>
          </ul>

          <h2>6. Finalidades do Tratamento</h2>
          <p>Utilizamos seus dados pessoais para as seguintes finalidades:</p>
          <ul>
            <li>Fornecer e manter nossos serviços;</li>
            <li>Processar e gerenciar sua conta e os documentos que você faz upload;</li>
            <li>Gerar insights e análises sobre seus documentos através de inteligência artificial;</li>
            <li>Melhorar e personalizar sua experiência na plataforma;</li>
            <li>Enviar comunicações relacionadas ao serviço;</li>
            <li>Enviar comunicações de marketing (apenas com seu consentimento específico);</li>
            <li>Detectar e prevenir fraudes e abusos;</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>

          <h2>7. Compartilhamento de Dados</h2>
          <p>
            Não vendemos seus dados pessoais. Podemos compartilhar seus dados nas seguintes circunstâncias:
          </p>
          <ul>
            <li><strong>Prestadores de serviços:</strong> empresas que nos auxiliam na operação da plataforma (ex: serviços de hospedagem, processamento de pagamentos).</li>
            <li><strong>Requisitos legais:</strong> quando exigido por lei, ordem judicial ou autoridade competente.</li>
            <li><strong>Proteção de direitos:</strong> quando necessário para proteger nossos direitos, sua segurança ou a de terceiros.</li>
          </ul>
          <p>
            Todos os terceiros com os quais compartilhamos dados estão sujeitos a obrigações contratuais de confidencialidade e proteção de dados.
          </p>

          <h2>8. Segurança dos Dados</h2>
          <p>
            Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados pessoais contra acesso não autorizado, perda acidental, divulgação ou destruição, em conformidade com o Art. 46 da LGPD. Estas medidas incluem:
          </p>
          <ul>
            <li>Criptografia de dados em trânsito e em repouso;</li>
            <li>Controles de acesso rigorosos;</li>
            <li>Monitoramento contínuo de segurança;</li>
            <li>Treinamento regular de nossa equipe em práticas de segurança;</li>
            <li>Avaliações periódicas de segurança e testes de penetração.</li>
          </ul>

          <h2>9. Seus Direitos como Titular de Dados</h2>
          <p>
            De acordo com o Art. 18 da LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:
          </p>
          <ul>
            <li><strong>Confirmação e Acesso (Art. 18, I e II):</strong> confirmar a existência de tratamento e acessar seus dados.</li>
            <li><strong>Correção (Art. 18, III):</strong> solicitar a correção de dados incompletos, inexatos ou desatualizados.</li>
            <li><strong>Anonimização, Bloqueio ou Eliminação (Art. 18, IV):</strong> solicitar a anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.</li>
            <li><strong>Portabilidade (Art. 18, V):</strong> solicitar a portabilidade dos dados a outro fornecedor de serviço ou produto.</li>
            <li><strong>Eliminação (Art. 18, VI):</strong> solicitar a eliminação dos dados tratados com base no consentimento.</li>
            <li><strong>Informação sobre Compartilhamento (Art. 18, VII):</strong> obter informação sobre entidades públicas e privadas com as quais compartilhamos seus dados.</li>
            <li><strong>Informação sobre Consentimento (Art. 18, VIII):</strong> ser informado sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa.</li>
            <li><strong>Revogação do Consentimento (Art. 18, IX):</strong> revogar o consentimento a qualquer momento.</li>
          </ul>
          <p>
            Você pode exercer esses direitos através das configurações da sua conta ou entrando em contato conosco pelo e-mail privacidade@docai.com.br.
          </p>

          <h2>10. Retenção de Dados</h2>
          <p>
            Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades para as quais foram coletados, incluindo obrigações legais, contratuais, de prestação de contas ou requisição de autoridades competentes.
          </p>
          <p>
            Quando os dados não forem mais necessários, serão excluídos ou anonimizados, a menos que tenhamos obrigação legal de mantê-los por período maior.
          </p>

          <h2>11. Transferência Internacional de Dados</h2>
          <p>
            Podemos transferir seus dados para servidores localizados fora do Brasil. Nestes casos, asseguramos que a transferência seja realizada de acordo com os requisitos da LGPD (Art. 33), garantindo que o país de destino proporcione grau de proteção adequado ou mediante garantias específicas, como cláusulas contratuais.
          </p>

          <h2>12. Uso de Cookies e Tecnologias Semelhantes</h2>
          <p>
            Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, entender como você utiliza nossos serviços e personalizar nosso conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
          </p>

          <h2>13. Privacidade de Crianças e Adolescentes</h2>
          <p>
            Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente dados pessoais de crianças e adolescentes. Se tomarmos conhecimento de que coletamos dados pessoais de um menor de 18 anos sem o consentimento dos pais ou responsáveis, tomaremos medidas para remover essas informações.
          </p>

          <h2>14. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre disponível em nosso site. Recomendamos que você revise esta política regularmente. Alterações significativas serão notificadas por e-mail ou através de um aviso em nosso site.
          </p>

          <h2>15. Contato</h2>
          <p>
            Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade ou ao tratamento de seus dados pessoais, entre em contato com nosso Encarregado de Proteção de Dados (DPO):
          </p>
          <p>
            E-mail: dpo@docai.com.br<br />
            Endereço: Av. Paulista, 1000, São Paulo - SP, CEP 01310-100
          </p>

          <h2>16. Disposições Finais</h2>
          <p>
            Esta Política de Privacidade é regida pelas leis da República Federativa do Brasil, especialmente pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
          </p>
          <p>
            Ao utilizar nossos serviços, você reconhece que leu, entendeu e concorda com os termos desta Política de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
