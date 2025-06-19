import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ExclamationCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  // Esquema de validação com Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email é obrigatório')
      .email('Email inválido'),
    password: Yup.string()
      .required('Senha é obrigatória')
  });

  // Valores iniciais do formulário
  const initialValues = {
    email: '',
    password: ''
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setServerError('');
      
      // Usar o contexto de autenticação para login
      const success = await login(values.email, values.password);
      
      if (success) {
        toast.success('Login administrativo realizado com sucesso!');
        
        // Redirecionar para o dashboard administrativo
        // Usar window.location.href para forçar um redirecionamento completo
        window.location.href = '/admin/dashboard';
      } else {
        setServerError('Credenciais inválidas. Verifique seu email e senha.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setServerError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
      toast.error('Falha na autenticação administrativa');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ShieldCheckIcon className="h-16 w-16 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Painel Administrativo
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Acesso restrito a administradores do sistema
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
                {/* Campo de email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email administrativo
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
                    Senha
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
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

                {/* Botão de login */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Autenticando...' : 'Entrar no Painel Administrativo'}
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

export default AdminLoginPage;
