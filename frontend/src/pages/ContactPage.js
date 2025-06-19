import React from 'react';

const ContactPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
              Entre em contato conosco
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-0 lg:col-span-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Suporte</h3>
                <dl className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd>suporte@docai.com.br</dd>
                  </div>
                  <div className="mt-1">
                    <dt className="sr-only">Telefone</dt>
                    <dd>(11) 1234-5678</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vendas</h3>
                <dl className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd>vendas@docai.com.br</dd>
                  </div>
                  <div className="mt-1">
                    <dt className="sr-only">Telefone</dt>
                    <dd>(11) 1234-5679</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-16 lg:grid lg:grid-cols-3 lg:gap-8">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
              Envie uma mensagem
            </h2>
            <div className="mt-8 lg:mt-0 lg:col-span-2">
              <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="given-name"
                      className="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sobrenome
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      autoComplete="family-name"
                      className="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mensagem
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    ></textarea>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Enviar mensagem
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
