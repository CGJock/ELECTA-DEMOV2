'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WhitelistUser {
  id: number;
  name: string;
  email: string;
  status: 'approved' | 'denied' | 'pending';
  created_at: string;
  updated_at: string;
  created_by?: number;
  notes?: string;
}

interface WhitelistManagementProps {
  notifications: {
    showSuccess: (title: string, message: string) => void;
    showError: (title: string, message: string) => void;
    showWarning: (title: string, message: string) => void;
  };
}

export default function WhitelistManagement({ notifications }: WhitelistManagementProps) {
  const { t } = useTranslation();
  
  // Estados principales
  const [users, setUsers] = useState<WhitelistUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<WhitelistUser | null>(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: ''
  });
  
  // Estados de filtros y búsqueda
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  
  // Estados de paginación
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  // Estados de confirmación
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    userId: number | null;
    userName: string;
  }>({
    isOpen: false,
    userId: null,
    userName: ''
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, [pagination.page, filters]);

  // Función para cargar usuarios
  // Cargar usuarios
const loadUsers = async () => {
  try {
    setLoading(true);

    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString()
    });

    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const response = await fetch(`http://localhost:5000/api/whitelist?${params}`, {
      credentials: 'include' 
    });

    if (!response.ok) throw new Error('Error al cargar usuarios');

    const data = await response.json();

    if (data.success) {
      setUsers(data.data || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
        totalPages: data.totalPages || 0
      }));
    } else {
      notifications.showError('Error', data.error || 'Error al cargar usuarios');
    }
  } catch (error) {
    console.error('Error:', error);
    notifications.showError('Error', 'Error al cargar usuarios');
  } finally {
    setLoading(false);
  }
};

// Crear/editar usuario
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const url = editingUser
      ? `http://localhost:5000/api/whitelist/${editingUser.id}`
      : 'http://localhost:5000/api/whitelist';

    const method = editingUser ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ✅ Enviar cookie
      body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error('Error en la operación');

    const data = await response.json();

    if (data.success) {
      notifications.showSuccess(
        editingUser ? 'Usuario Actualizado' : 'Usuario Creado',
        data.message || 'Operación exitosa'
      );

      setShowForm(false);
      setEditingUser(null);
      resetForm();
      loadUsers();
    } else {
      notifications.showError('Error', data.error || 'Error en la operación');
    }
  } catch (error) {
    console.error('Error:', error);
    notifications.showError('Error', 'Error en la operación');
  }
};

// Cambiar status de usuario
const handleStatusChange = async (userId: number, newStatus: 'approved' | 'denied' | 'pending') => {
  try {
    const response = await fetch(`http://localhost:5000/api/whitelist/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ✅ Enviar cookie
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) throw new Error('Error al cambiar status');

    const data = await response.json();

    if (data.success) {
      notifications.showSuccess('Status Actualizado', 'Status del usuario actualizado exitosamente');
      loadUsers();
    } else {
      notifications.showError('Error', data.error || 'Error al cambiar status');
    }
  } catch (error) {
    console.error('Error:', error);
    notifications.showError('Error', 'Error al cambiar status');
  }
};

// Eliminar usuario
const handleDelete = async () => {
  if (!deleteConfirm.userId) return;

  try {
    const response = await fetch(`http://localhost:5000/api/whitelist/${deleteConfirm.userId}`, {
      method: 'DELETE',
      credentials: 'include' // ✅ Enviar cookie
    });

    if (!response.ok) throw new Error('Error al eliminar usuario');

    const data = await response.json();

    if (data.success) {
      notifications.showSuccess('Usuario Eliminado', 'Usuario eliminado exitosamente');
      setDeleteConfirm({ isOpen: false, userId: null, userName: '' });
      loadUsers();
    } else {
      notifications.showError('Error', data.error || 'Error al eliminar usuario');
    }
  } catch (error) {
    console.error('Error:', error);
    notifications.showError('Error', 'Error al eliminar usuario');
  }
};


  // Función para editar usuario
  const handleEdit = (user: WhitelistUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      notes: user.notes || ''
    });
    setShowForm(true);
  };

  // Función para resetear formulario
  const resetForm = () => {
    setFormData({ name: '', email: '', notes: '' });
    setEditingUser(null);
  };

  // Función para abrir formulario de creación
  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  // Función para cerrar formulario
  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  // Función para cambiar página
  const changePage = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Función para aplicar filtros
  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({ status: '', search: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Función para obtener el color del status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/10';
      case 'denied': return 'text-red-400 bg-red-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  // Función para obtener el icono del status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'denied': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  // Función para obtener el texto del status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprobado';
      case 'denied': return 'Denegado';
      case 'pending': return 'Pendiente';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">
          Gestión de Lista de Acceso
        </h3>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Usuario
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          
          {/* Filtro de status */}
          <div className="w-full md:w-48">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
            >
              <option value="">Todos los status</option>
              <option value="approved">Aprobado</option>
              <option value="denied">Denegado</option>
              <option value="pending">Pendiente</option>
            </select>
          </div>
          
          {/* Botones de filtros */}
          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-700/30">
                <th className="text-left py-3 px-4 text-white font-medium">Usuario</th>
                <th className="text-left py-3 px-4 text-white font-medium">Status</th>
                <th className="text-left py-3 px-4 text-white font-medium">Fecha Creación</th>
                <th className="text-left py-3 px-4 text-white font-medium">Notas</th>
                <th className="text-left py-3 px-4 text-white font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        {getStatusText(user.status)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm max-w-xs truncate">
                      {user.notes || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {/* Botón de editar */}
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title="Editar usuario"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        {/* Botones de status */}
                        <button
                          onClick={() => handleStatusChange(user.id, 'approved')}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'approved' 
                              ? 'text-green-400 bg-green-400/20' 
                              : 'text-green-400 hover:text-green-300 hover:bg-green-400/10'
                          }`}
                          title="Aprobar usuario"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleStatusChange(user.id, 'denied')}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'denied' 
                              ? 'text-red-400 bg-red-400/20' 
                              : 'text-red-400 hover:text-red-300 hover:bg-red-400/10'
                          }`}
                          title="Denegar usuario"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleStatusChange(user.id, 'pending')}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'pending' 
                              ? 'text-yellow-400 bg-yellow-400/20' 
                              : 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10'
                          }`}
                          title="Marcar como pendiente"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        
                        {/* Botón de eliminar */}
                        <button
                          onClick={() => setDeleteConfirm({
                            isOpen: true,
                            userId: user.id,
                            userName: user.name
                          })}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-700/30">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} usuarios
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => changePage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 bg-slate-700 text-white rounded-lg">
                  {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => changePage(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
              </h3>
              <button
                onClick={closeForm}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  placeholder="Nombre completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  placeholder="email@ejemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  placeholder="Notas opcionales..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-slate-300 mb-6">
              ¿Estás seguro de que quieres eliminar al usuario "{deleteConfirm.userName}"? 
              Esta acción no se puede deshacer.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
              <button
                onClick={() => setDeleteConfirm({ isOpen: false, userId: null, userName: '' })}
                className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
