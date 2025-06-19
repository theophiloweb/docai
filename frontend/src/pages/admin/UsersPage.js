import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  NoSymbolIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { toast } from 'react-toastify';
import UserModal from '../../components/admin/UserModal';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const UsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Estados para modais
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  // Carregar usuários do banco de dados
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/users');
        if (response.data.success) {
          setUsers(response.data.data.users);
        } else {
          console.error('Erro ao carregar usuários:', response.data.message);
          toast.error('Falha ao carregar usuários. Tente novamente mais tarde.');
        }
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        toast.error('Falha ao carregar usuários. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    // Carregar usuários
    fetchUsers();
  }, []);

  // Função para formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'inactive':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'blocked':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  // Filtrar usuários com base no status e termo de busca
  const filteredUsers = users.filter(user => {
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Funções de manipulação de usuários
  const handleAddUser = () => {
    setCurrentUser(null);
    setIsEditing(false);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser({...user}); // Clonar o objeto para evitar referência direta
    setIsEditing(true);
    setIsUserModalOpen(true);
  };

  const handleBlockUser = (user) => {
    setCurrentUser(user);
    setConfirmTitle(user.status === 'blocked' 
      ? 'Desbloquear Usuário' 
      : 'Bloquear Usuário');
    setConfirmMessage(user.status === 'blocked' 
      ? 'Tem certeza que deseja desbloquear este usuário?' 
      : 'Tem certeza que deseja bloquear este usuário?');
    setConfirmAction('block');
    setIsConfirmModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setConfirmTitle('Excluir Usuário');
    setConfirmMessage('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.');
    setConfirmAction('delete');
    setIsConfirmModalOpen(true);
  };

  // Funções para salvar alterações
  const handleSaveUser = async (userData) => {
    try {
      if (isEditing) {
        // Atualizar usuário existente
        const response = await api.put(`/admin/users/${currentUser.id}`, userData);
        
        if (response.data && response.data.success) {
          // Atualizar estado local
          setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...userData } : u));
          toast.success('Usuário atualizado com sucesso');
        } else {
          toast.error(response.data?.message || 'Erro ao atualizar usuário');
        }
      } else {
        // Criar novo usuário
        const response = await api.post('/admin/users', userData);
        
        if (response.data && response.data.success) {
          // Adicionar ao estado local
          const newUser = response.data.data.user;
          setUsers([...users, newUser]);
          toast.success('Usuário adicionado com sucesso');
        } else {
          toast.error(response.data?.message || 'Erro ao adicionar usuário');
        }
      }
      
      setIsUserModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast.error(isEditing ? 'Erro ao atualizar usuário' : 'Erro ao adicionar usuário');
    }
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmAction === 'delete') {
        // Excluir usuário
        const response = await api.delete(`/admin/users/${currentUser.id}`);
        
        if (response.data && response.data.success) {
          // Atualizar estado local
          setUsers(users.filter(u => u.id !== currentUser.id));
          toast.success('Usuário excluído com sucesso');
        } else {
          toast.error(response.data?.message || 'Erro ao excluir usuário');
        }
      } else if (confirmAction === 'block') {
        // Bloquear/desbloquear usuário
        const newStatus = currentUser.status === 'blocked' ? 'active' : 'blocked';
        const response = await api.patch(`/admin/users/${currentUser.id}/status`, { status: newStatus });
        
        if (response.data && response.data.success) {
          // Atualizar estado local
          setUsers(users.map(u => u.id === currentUser.id ? { ...u, status: newStatus } : u));
          toast.success(currentUser.status === 'blocked' 
            ? 'Usuário desbloqueado com sucesso' 
            : 'Usuário bloqueado com sucesso');
        } else {
          toast.error(response.data?.message || 'Erro ao alterar status do usuário');
        }
      }
      
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error('Erro ao executar ação:', error);
      toast.error(confirmAction === 'delete' 
        ? 'Erro ao excluir usuário' 
        : 'Erro ao alterar status do usuário');
    }
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
            Usuários
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gerencie os usuários do sistema
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={handleAddUser}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Adicionar Usuário
          </button>
        </div>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="mb-6 bg-white dark:bg-gray-800 shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Pesquisar</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Pesquisar usuários"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
            <div>
              <label htmlFor="status" className="sr-only">Filtrar por status</label>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="blocked">Bloqueado</option>
              </select>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <FunnelIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de usuários */}
      {filteredUsers.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <li key={user.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                          <UserIcon className="h-6 w-6" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status === 'active' ? 'Ativo' : user.status === 'inactive' ? 'Inativo' : 'Bloqueado'}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            {user.plan}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {user.lastLogin ? `Último login: ${formatDate(user.lastLogin)}` : 'Nunca fez login'}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                          title="Editar"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleBlockUser(user)}
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400"
                          title={user.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}
                        >
                          <NoSymbolIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          title="Excluir"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md p-6 text-center">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum usuário encontrado</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || selectedStatus !== 'all' 
              ? 'Nenhum usuário corresponde aos filtros aplicados'
              : 'Comece adicionando um novo usuário ao sistema'}
          </p>
        </div>
      )}

      {/* Modal de usuário */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={currentUser}
        onSave={handleSaveUser}
        isEditing={isEditing}
      />

      {/* Modal de confirmação */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={confirmTitle}
        message={confirmMessage}
      />
    </div>
  );
};

export default UsersPage;
