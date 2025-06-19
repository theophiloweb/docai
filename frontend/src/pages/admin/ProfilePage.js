import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  IdentificationIcon,
  KeyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AdminProfilePage = () => {
  const { t } = useTranslation();
  const { user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  // Esquema de validação para informações pessoais
  const personalInfoSchema = Yup.object().shape({
    fullName: Yup.string().required('Nome completo é obrigatório'),
    position: Yup.string(),
    department: Yup.string(),
    phone: Yup.string()
  });

  // Carregar perfil do administrador
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/profile');
        
        if (response.data && response.data.success) {
          setProfile(response.data.data.profile);
        } else {
          throw new Error('Falha ao carregar perfil');
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        toast.error('Falha ao carregar dados do perfil');
        
        // Criar perfil padrão se não for possível carregar
        setProfile({
          fullName: user?.name || '',
          email: user?.email || '',
          position: 'Administrador',
          department: 'TI',
          employeeId: 'ADM-001',
          phone: '',
          permissions: {
            users: true,
            documents: true,
            plans: true,
            settings: true,
            logs: true,
            reports: true,
            api: false
          },
          isSuperAdmin: true,
          lastActivity: new Date().toISOString(),
          lastLogin: user?.lastLogin || new Date().toISOString(),
          createdAt: user?.createdAt || new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  // Função para atualizar perfil
  const handleUpdateProfile = async (values) => {
    try {
      setSaving(true);
      
      const response = await api.put('/admin/profile', {
        fullName: values.fullName,
        position: values.position,
        department: values.department,
        phone: values.phone
      });
      
      if (response.data && response.data.success) {
        setProfile(response.data.data.profile);
        
        // Atualizar dados do usuário no contexto de autenticação
        if (values.fullName !== user.name) {
          updateUserData({ name: values.fullName });
        }
        
        toast.success('Perfil atualizado com sucesso');
      } else {
        throw new Error('Falha ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Falha ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            {t('admin.profile.title')}
          </h2>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        {/* Cabeçalho do perfil */}
        <div className="px-4 py-5 sm:px-6 flex items-center">
          <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 mr-4">
            <UserIcon className="h-8 w-8" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {profile.fullName}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {profile.position} {profile.department ? `- ${profile.department}` : ''}
            </p>
            <div className="mt-1 flex items-center">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                profile.isSuperAdmin 
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {profile.isSuperAdmin ? 'Super Admin' : 'Administrador'}
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                ID: {profile.employeeId}
              </span>
            </div>
          </div>
        </div>

        {/* Abas */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('personal')}
              className={`${
                activeTab === 'personal'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Informações Pessoais
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`${
                activeTab === 'security'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Segurança
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`${
                activeTab === 'permissions'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Permissões
            </button>
          </nav>
        </div>

        {/* Conteúdo das abas */}
        <div className="px-4 py-5 sm:p-6">
          {/* Aba de informações pessoais */}
          {activeTab === 'personal' && (
            <Formik
              initialValues={{
                fullName: profile.fullName || '',
                position: profile.position || '',
                department: profile.department || '',
                phone: profile.phone || ''
              }}
              validationSchema={personalInfoSchema}
              onSubmit={handleUpdateProfile}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Nome completo */}
                    <div className="sm:col-span-3">
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nome completo
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <Field
                          type="text"
                          name="fullName"
                          id="fullName"
                          className={`pl-10 block w-full shadow-sm sm:text-sm rounded-md ${
                            errors.fullName && touched.fullName
                              ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-500'
                              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                          }`}
                        />
                        {errors.fullName && touched.fullName && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.fullName && touched.fullName && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email (somente leitura) */}
                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={profile.email}
                          disabled
                          className="pl-10 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50 dark:bg-gray-600 dark:border-gray-700 dark:text-gray-300"
                        />
                      </div>
                    </div>

                    {/* Cargo */}
                    <div className="sm:col-span-3">
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cargo
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IdentificationIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <Field
                          type="text"
                          name="position"
                          id="position"
                          className="pl-10 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Departamento */}
                    <div className="sm:col-span-3">
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Departamento
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BuildingOfficeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <Field
                          type="text"
                          name="department"
                          id="department"
                          className="pl-10 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Telefone */}
                    <div className="sm:col-span-3">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Telefone
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <Field
                          type="text"
                          name="phone"
                          id="phone"
                          className="pl-10 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* ID de Funcionário (somente leitura) */}
                    <div className="sm:col-span-3">
                      <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        ID de Funcionário
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IdentificationIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          id="employeeId"
                          value={profile.employeeId || '-'}
                          disabled
                          className="pl-10 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50 dark:bg-gray-600 dark:border-gray-700 dark:text-gray-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informações adicionais */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Informações da conta
                    </h4>
                    <div className="grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-2">
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Último login:</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(profile.lastLogin)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Última atividade:</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(profile.lastActivity)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Conta criada em:</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(profile.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Status:</span>
                        <p className="text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            profile.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {profile.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botões de ação */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {saving ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {/* Aba de segurança */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <KeyIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      As configurações de segurança são gerenciadas pelo administrador do sistema.
                      Entre em contato com o suporte para alterações de senha ou configurações de segurança.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Segurança da conta</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Configurações relacionadas à segurança da sua conta de administrador.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Alterar senha
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      Por motivos de segurança, a alteração de senha deve ser feita através do sistema de gerenciamento de usuários.
                    </p>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                    >
                      Contatar suporte
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Autenticação de dois fatores
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      Adicione uma camada extra de segurança à sua conta ativando a autenticação de dois fatores.
                    </p>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                    >
                      Configurar 2FA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba de permissões */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ShieldCheckIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {profile.isSuperAdmin 
                        ? 'Você é um Super Administrador com acesso completo ao sistema.' 
                        : 'Suas permissões são definidas pelo administrador do sistema.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Permissões de acesso</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Suas permissões atuais no sistema Doc.AI.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {profile.permissions && Object.entries(profile.permissions).map(([key, value]) => (
                    <li key={key} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            value ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                          }`}>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              {value ? (
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              ) : (
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              )}
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                              {key === 'users' ? 'Usuários' : 
                               key === 'documents' ? 'Documentos' : 
                               key === 'plans' ? 'Planos' : 
                               key === 'settings' ? 'Configurações' : 
                               key === 'logs' ? 'Logs' : 
                               key === 'reports' ? 'Relatórios' : 
                               key === 'api' ? 'API' : key}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {value ? 'Acesso permitido' : 'Acesso negado'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
