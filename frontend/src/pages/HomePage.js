import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  FolderIcon, 
  DevicePhoneMobileIcon,
  LockClosedIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import ChatbotWidget from '../components/ChatbotWidget';

const HomePage = () => {
  const { t } = useTranslation();

  // Recursos destacados
  const features = [
    {
      name: t('home.features.secure.title'),
      description: t('home.features.secure.description'),
      icon: ShieldCheckIcon,
    },
    {
      name: t('home.features.ai.title'),
      description: t('home.features.ai.description'),
      icon: DocumentTextIcon,
    },
    {
      name: t('home.features.organize.title'),
      description: t('home.features.organize.description'),
      icon: FolderIcon,
    },
    {
      name: t('home.features.access.title'),
      description: t('home.features.access.description'),
      icon: DevicePhoneMobileIcon,
    },
  ];

  // Depoimentos
  const testimonials = [
    {
      content: "O Doc.AI revolucionou a forma como organizo meus documentos. Agora consigo encontrar tudo em segundos!",
      author: "Maria Silva",
      role: "Advogada"
    },
    {
      content: "Os insights gerados pela IA me ajudaram a identificar padrões nos meus exames médicos que eu nunca teria percebido.",
      author: "Carlos Oliveira",
      role: "Engenheiro"
    },
    {
      content: "A segurança e privacidade do Doc.AI me dão tranquilidade para armazenar documentos sensíveis.",
      author: "Ana Santos",
      role: "Médica"
    }
  ];

  // Planos de assinatura
  const plans = [
    {
      name: "Gratuito",
      description: "Período de teste de 30 dias",
      price: "R$ 0",
      duration: "30 dias",
      features: [
        "Registro básico",
        "Upload de documentos limitado",
        "Notas de saúde",
        "Suporte por email"
      ],
      cta: "Começar gratuitamente",
      highlighted: false
    },
    {
      name: "Premium",
      description: "Plano anual para usuários individuais",
      price: "R$ 100",
      duration: "por ano",
      features: [
        "Registro completo",
        "Upload ilimitado",
        "Histórico completo",
        "Suporte prioritário",
        "Análise avançada de documentos",
        "Exportação de dados"
      ],
      cta: "Assinar agora",
      highlighted: true
    },
    {
      name: "Familiar",
      description: "Plano para até 5 membros da família",
      price: "R$ 200",
      duration: "por ano",
      features: [
        "Até 5 membros",
        "Upload ilimitado",
        "Histórico completo",
        "Suporte prioritário",
        "Análise avançada de documentos",
        "Compartilhamento familiar",
        "Exportação de dados"
      ],
      cta: "Escolher plano familiar",
      highlighted: false
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-teal-600 mix-blend-multiply" />
        </div>
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('home.hero.title')}
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-100">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
              <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                <Link
                  to="/cadastro"
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-gray-50 sm:px-8"
                >
                  {t('home.hero.cta')}
                </Link>
                <Link
                  to="/sobre"
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                >
                  {t('nav.about')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 dark:text-primary-400 tracking-wide uppercase">
              {t('home.features.title')}
            </h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl sm:tracking-tight">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root bg-gray-50 dark:bg-gray-700 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">
                        {feature.name}
                      </h3>
                      <p className="mt-5 text-base text-gray-500 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-100 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 dark:text-primary-400 tracking-wide uppercase">
              Planos
            </h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl sm:tracking-tight">
              Escolha o plano ideal para você
            </p>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Oferecemos opções flexíveis para atender às suas necessidades, desde um período de teste gratuito até planos familiares completos.
            </p>
          </div>

          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-lg shadow-lg divide-y divide-gray-200 dark:divide-gray-700 ${
                plan.highlighted 
                  ? 'border-2 border-primary-500 dark:border-primary-400' 
                  : 'border border-gray-200 dark:border-gray-700'
              }`}>
                <div className="p-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{plan.name}</h2>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-base font-medium text-gray-500 dark:text-gray-400">{plan.duration}</span>
                  </p>
                  <Link
                    to="/cadastro"
                    className={`mt-8 block w-full py-2 px-4 border border-transparent rounded-md shadow text-sm font-medium text-white text-center ${
                      plan.highlighted 
                        ? 'bg-primary-600 hover:bg-primary-700' 
                        : 'bg-gray-800 dark:bg-gray-600 hover:bg-gray-900 dark:hover:bg-gray-500'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wide">
                    O que está incluído
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex space-x-3">
                        <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-primary-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                {t('home.privacy.title')}
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500 dark:text-gray-300">
                {t('home.privacy.description')}
              </p>
              <div className="mt-8">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    to="/politica-privacidade"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    {t('home.privacy.learn_more')}
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="flex justify-center">
                <LockClosedIcon className="h-32 w-32 text-primary-500 dark:text-primary-400" />
              </div>
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <blockquote>
                  <div>
                    <p className="text-base text-gray-500 dark:text-gray-300">
                      "A Lei Geral de Proteção de Dados estabelece que o titular dos dados tem direito a obter do controlador, a qualquer momento, informações sobre seus dados."
                    </p>
                  </div>
                  <footer className="mt-3">
                    <div className="flex items-center">
                      <div className="text-base font-medium text-gray-700 dark:text-gray-300">
                        Art. 18, LGPD
                      </div>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white dark:bg-gray-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {t('home.testimonials.title')}
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
              {t('home.testimonials.subtitle')}
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-600 rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                  <p className="text-gray-600 dark:text-gray-200 italic">"{testimonial.content}"</p>
                  <div className="mt-6">
                    <p className="text-base font-medium text-gray-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">{t('home.cta.title')}</span>
            <span className="block text-primary-200">{t('home.cta.subtitle')}</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/cadastro"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
              >
                {t('home.cta.button')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
};

export default HomePage;
