import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const { forgotPassword } = useAuth();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  // Esquema de validação com Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .required(t('errors.required'))
      .email(t('errors.email'))
  });

  // Valores iniciais do formulário
  const initialValues = {
    email: ''
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setServerError('');
      setSuccess(false);
      
      // Chamar função de recuperação de senha do contexto de autenticação
      const result = await forgotPassword(values.email);
      
      if (result) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      setServerError(error.message || t('errors.server_error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {t('auth.forgot.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {t('auth.forgot.subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Exibir erro do servidor, se houver */}
          {serverError && (
            <div className="mb-4 bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{serverError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Exibir mensagem de sucesso, se houver */}
          {success && (
            <div className="mb-4 bg-green-50 dark:bg-green-900 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {t('auth.forgotPasswordSuccess')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                {/* Campo de email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.forgot.email')}
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.email && touched.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                    />
                    {errors.email && touched.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <ErrorMessage name="email" component="p" className="mt-2 text-sm text-red-600 dark:text-red-400" />
                </div>

                {/* Botão de enviar */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t('common.loading') : t('auth.forgot.submit')}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          {/* Link para login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  ou
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {t('auth.forgot.back')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
