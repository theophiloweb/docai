import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  // Esquema de validação com Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .required(t('errors.required'))
      .email(t('errors.email')),
    password: Yup.string()
      .required(t('errors.required'))
  });

  // Valores iniciais do formulário
  const initialValues = {
    email: '',
    password: '',
    remember: false
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setServerError('');
      
      // Chamar função de login do contexto de autenticação
      const success = await login(values.email, values.password);
      
      if (success) {
        // Redirecionar para o dashboard de cliente
        window.location.href = '/dashboard';
        return;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setServerError(error.message || t('errors.server_error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          {t('auth.login.title')}
        </h2>
        <p className="text-center text-xs text-gray-600 dark:text-gray-400">
          {t('auth.login.subtitle')}
        </p>
      </div>

      <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-4 px-4 shadow sm:rounded-lg sm:px-8">
          {/* Exibir erro do servidor, se houver */}
          {serverError && (
            <div className="mb-2 bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-2">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-4 w-4 text-red-500" aria-hidden="true" />
                </div>
                <div className="ml-2">
                  <p className="text-xs text-red-700 dark:text-red-300">{serverError}</p>
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
              <Form className="space-y-3">
                {/* Campo de email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.login.email')}
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`appearance-none block w-full px-3 py-1.5 border ${
                        errors.email && touched.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                    />
                    {errors.email && touched.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-4 w-4 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <ErrorMessage name="email" component="p" className="mt-0.5 text-xs text-red-600 dark:text-red-400" />
                </div>

                {/* Campo de senha */}
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.login.password')}
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className={`appearance-none block w-full px-3 py-1.5 border ${
                        errors.password && touched.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                    />
                    {errors.password && touched.password && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-4 w-4 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <ErrorMessage name="password" component="p" className="mt-0.5 text-xs text-red-600 dark:text-red-400" />
                </div>

                {/* Botão de login */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-1.5 px-4 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t('common.loading') : t('auth.login.submit')}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
