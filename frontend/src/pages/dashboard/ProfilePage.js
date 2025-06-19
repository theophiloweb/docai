import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, updateUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Esquema de validação para informações pessoais
  const personalInfoSchema = Yup.object({
    name: Yup.string()
      .required(t('errors.required'))
      .min(3, t('errors.min_length', { min: 3 }))
      .max(100, t('errors.max_length', { max: 100 }))
  });

  // Esquema de validação para alteração de senha
  const passwordSchema = Yup.object({
    currentPassword: Yup.string()
      .required(t('errors.required')),
    newPassword: Yup.string()
      .required(t('errors.required'))
      .min(8, t('errors.min_length', { min: 8 })),
    confirmPassword: Yup.string()
      .required(t('errors.required'))
      .oneOf([Yup.ref('newPassword'), null], t('errors.password_match'))
  });

  // Função para atualizar informações pessoais
  const handleUpdatePersonalInfo = async (values, { setSubmitting, setStatus }) => {
    try {
      // Simulação de atualização bem-sucedida
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar dados do usuário no contexto
      updateUserData({
        name: values.name
      });
      
      setStatus({ success: true, message: t('profile.save_success') });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setStatus({ success: false, message: t('profile.save_error') });
    } finally {
      setSubmitting(false);
    }
  };

  // Função para atualizar senha
  const handleUpdatePassword = async (values, { setSubmitting, setStatus, resetForm }) => {
    try {
      // Simulação de atualização bem-sucedida
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus({ success: true, message: t('profile.password_success') });
      resetForm();
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      setStatus({ success: false, message: t('profile.password_error') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            {t('profile.title')}
          </h2>
        </div>
      </div>

      {/* Abas */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'personal'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('personal')}
          >
            {t('profile.personal.title')}
          </button>
          <button
            className={`${
              activeTab === 'password'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('password')}
          >
            {t('profile.password.title')}
          </button>
          <button
            className={`${
              activeTab === 'data'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('data')}
          >
            {t('profile.data.title')}
          </button>
        </nav>
      </div>

      {/* Conteúdo da aba */}
      <div className="mt-6">
        {/* Informações pessoais */}
        {activeTab === 'personal' && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <Formik
                initialValues={{
                  name: user?.name || '',
                  email: user?.email || ''
                }}
                validationSchema={personalInfoSchema}
                onSubmit={handleUpdatePersonalInfo}
              >
                {({ isSubmitting, errors, touched, status }) => (
                  <Form className="space-y-6">
                    {/* Nome */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('profile.personal.name')}
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('profile.personal.email')}
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          disabled
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 sm:text-sm cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Botão de salvar */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {isSubmitting ? t('common.loading') : t('profile.personal.save')}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {/* Alteração de senha */}
        {activeTab === 'password' && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <Formik
                initialValues={{
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                }}
                validationSchema={passwordSchema}
                onSubmit={handleUpdatePassword}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    {/* Senha atual */}
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('profile.password.current')}
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Nova senha */}
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('profile.password.new')}
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Confirmar nova senha */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('profile.password.confirm')}
                      </label>
                      <div className="mt-1 relative">
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Botão de salvar */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {isSubmitting ? t('common.loading') : t('profile.password.save')}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {/* Meus dados */}
        {activeTab === 'data' && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {t('profile.data.title')}
              </h3>
              <div className="mt-5">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  {t('profile.data.export')}
                </button>
              </div>
              <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-5">
                <h3 className="text-lg leading-6 font-medium text-red-600 dark:text-red-400">
                  Zona de perigo
                </h3>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    {t('profile.data.delete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão de conta */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {t('profile.data.delete_confirm.title')}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('profile.data.delete_confirm.message')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  {t('profile.data.delete_confirm.confirm')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  {t('profile.data.delete_confirm.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
