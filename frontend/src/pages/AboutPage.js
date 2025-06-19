import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Sobre o Doc.AI
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
              O Doc.AI é uma plataforma inovadora de gerenciamento inteligente de documentos pessoais, 
              desenvolvida com foco na segurança, privacidade e conformidade com a Lei Geral de Proteção 
              de Dados (LGPD).
            </p>
            <div className="mt-6">
              <div className="text-base font-medium text-primary-600 dark:text-primary-400">
                Nossa Missão
              </div>
              <div className="mt-2 text-lg text-gray-500 dark:text-gray-300">
                Capacitar as pessoas a gerenciar seus documentos pessoais de forma segura e inteligente, 
                extraindo insights valiosos através da inteligência artificial.
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <div className="pl-4 -ml-4 border-l border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Nossos Valores
              </h3>
              <dl className="mt-6 space-y-8">
                <div>
                  <dt className="text-lg font-medium text-gray-900 dark:text-white">
                    Privacidade em Primeiro Lugar
                  </dt>
                  <dd className="mt-2 text-base text-gray-500 dark:text-gray-300">
                    Respeitamos e protegemos a privacidade dos nossos usuários, seguindo rigorosamente 
                    os princípios da LGPD.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg font-medium text-gray-900 dark:text-white">
                    Inovação Responsável
                  </dt>
                  <dd className="mt-2 text-base text-gray-500 dark:text-gray-300">
                    Utilizamos tecnologias avançadas de IA para criar valor para nossos usuários, 
                    sempre de forma ética e transparente.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
