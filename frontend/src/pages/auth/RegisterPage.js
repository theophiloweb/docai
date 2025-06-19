import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

const RegisterPage = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  // Esquema de validação com Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t('errors.required'))
      .min(3, t('errors.min_length', { min: 3 }))
      .max(100, t('errors.max_length', { max: 100 })),
    email: Yup.string()
      .required(t('errors.required'))
      .email(t('errors.email')),
    password: Yup.string()
      .required(t('errors.required'))
      .min(8, t('errors.min_length', { min: 8 })),
    confirmPassword: Yup.string()
      .required(t('errors.required'))
      .oneOf([Yup.ref('password'), null], t('errors.password_match')),
    termsAccepted: Yup.boolean()
      .required(t('errors.required'))
      .oneOf([true], t('errors.terms'))
  });

  // Valores iniciais do formulário
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    consents: {
      marketing_emails: false
    }
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setServerError('');
      
      // Preparar dados para registro
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        termsAccepted: values.termsAccepted,
        consents: values.consents
      };
      
      // Chamar função de registro do contexto de autenticação
      const success = await register(userData);
      
      if (success) {
        // Redirecionar para o dashboard após registro bem-sucedido
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setServerError(error.message || t('errors.server_error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {t('auth.register.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {t('auth.register.subtitle')}
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

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                {/* Campo de nome */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.register.name')}
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.name && touched.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                    />
                    {errors.name && touched.name && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <ErrorMessage name="name" component="p" className="mt-2 text-sm text-red-600 dark:text-red-400" />
                </div>

                {/* Campo de email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.register.email')}
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

                {/* Campo de senha */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.register.password')}
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.password && touched.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                    />
                    {errors.password && touched.password && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <ErrorMessage name="password" component="p" className="mt-2 text-sm text-red-600 dark:text-red-400" />
                </div>

                {/* Campo de confirmação de senha */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.register.confirm_password')}
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <ErrorMessage name="confirmPassword" component="p" className="mt-2 text-sm text-red-600 dark:text-red-400" />
                </div>

                {/* Checkbox de termos de serviço */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <Field
                      id="termsAccepted"
                      name="termsAccepted"
                      type="checkbox"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="termsAccepted" className="font-medium text-gray-700 dark:text-gray-300">
                      {t('auth.register.terms')}{' '}
                      <Link to="/termos-servico" className="text-primary-600 dark:text-primary-400 hover:text-primary-500">
                        {t('auth.register.terms_link')}
                      </Link>{' '}
                      {t('auth.register.privacy')}{' '}
                      <Link to="/politica-privacidade" className="text-primary-600 dark:text-primary-400 hover:text-primary-500">
                        {t('auth.register.privacy_link')}
                      </Link>
                    </label>
                    <ErrorMessage name="termsAccepted" component="p" className="mt-2 text-sm text-red-600 dark:text-red-400" />
                  </div>
                </div>

                {/* Checkbox de consentimento para marketing */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <Field
                      id="consents.marketing_emails"
                      name="consents.marketing_emails"
                      type="checkbox"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="consents.marketing_emails" className="font-medium text-gray-700 dark:text-gray-300">
                      {t('auth.register.marketing')}
                    </label>
                  </div>
                </div>

                {/* Botão de cadastro */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t('common.loading') : t('auth.register.submit')}
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
                  {t('auth.register.has_account')}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {t('auth.register.login')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
