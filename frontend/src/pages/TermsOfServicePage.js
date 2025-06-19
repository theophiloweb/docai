import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Termos de Serviço
        </h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Última atualização: 08 de junho de 2025
        </p>

        <div className="mt-8 prose prose-primary dark:prose-invert max-w-none">
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar ou usar o serviço Doc.AI, você concorda em cumprir e estar vinculado a estes Termos de Serviço. 
            Se você não concordar com algum aspecto destes termos, não poderá usar nossos serviços.
          </p>

          <h2>2. Descrição do Serviço</h2>
          <p>
            O Doc.AI é uma plataforma de gerenciamento inteligente de documentos pessoais que permite aos usuários 
            fazer upload, organizar e obter insights de seus documentos através de tecnologias de inteligência artificial.
          </p>

          <h2>3. Conta de Usuário</h2>
          <p>
            Para utilizar nossos serviços, você deve criar uma conta e fornecer informações precisas e completas. 
            Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta.
          </p>

          <h2>4. Privacidade e Proteção de Dados</h2>
          <p>
            O tratamento de seus dados pessoais é regido por nossa Política de Privacidade, em conformidade com a 
            Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
          </p>

          <h2>5. Conteúdo do Usuário</h2>
          <p>
            Você mantém todos os direitos sobre os documentos e conteúdos que faz upload na plataforma.
          </p>

          <h2>6. Uso Aceitável</h2>
          <p>
            Você concorda em não usar nossos serviços para violar leis ou regulamentos aplicáveis.
          </p>

          <h2>7. Planos e Pagamentos</h2>
          <p>
            Oferecemos diferentes planos de assinatura, incluindo um período de teste gratuito.
          </p>

          <h2>8. Cancelamento e Rescisão</h2>
          <p>
            Você pode cancelar sua assinatura a qualquer momento.
          </p>

          <h2>9. Limitação de Responsabilidade</h2>
          <p>
            O Doc.AI é fornecido "como está", sem garantias de qualquer tipo.
          </p>

          <h2>10. Alterações nos Termos</h2>
          <p>
            Podemos modificar estes Termos a qualquer momento, publicando a versão atualizada em nosso site.
          </p>

          <h2>11. Lei Aplicável</h2>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do Brasil.
          </p>

          <h2>12. Contato</h2>
          <p>
            Se você tiver dúvidas sobre estes Termos, entre em contato conosco pelo e-mail: termos@docai.com.br
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
