'use client';

import React, { useState } from 'react';
import { useAdminManagement, AdminUser } from '@/context/adminManagementContext';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus, 
  Users, 
  Shield, 
  Save,
  X,
  Key
} from 'lucide-react';

interface AdminFormData {
  username: string;
  email: string;
  full_name: string;
  password: string;
}

interface NotificationFunctions {
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
}

interface AdminManagementProps {
  notifications: NotificationFunctions;
}

const AdminManagement: React.FC<AdminManagementProps> = ({ notifications }) => {
  const { t } = useTranslation();
  const { admins, addAdmin, updateAdmin, deleteAdmin, resetPassword, isLoading, error } = useAdminManagement();
  const { showSuccess, showError, showWarning } = notifications;
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<number | null>(null);
  const [formData, setFormData] = useState<AdminFormData>({
    username: '',
    email: '',
    full_name: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<AdminFormData>>({});

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      full_name: '',
      password: ''
    });
    setErrors({});
    setEditingAdmin(null);
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo
    if (errors[name as keyof AdminFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AdminFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = t('admin.sections.admin_management.form.username_required');
    } else if (formData.username.length < 3) {
      newErrors.username = t('admin.sections.admin_management.form.username_min_length');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('admin.sections.admin_management.form.email_required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('admin.sections.admin_management.form.email_invalid');
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = t('admin.sections.admin_management.form.full_name_required');
    }

    if (!editingAdmin && !formData.password.trim()) {
      newErrors.password = t('admin.sections.admin_management.form.password_required');
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = t('admin.sections.admin_management.form.password_min_length');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editingAdmin) {
        // Actualizar admin existente
        const updateData: Partial<AdminUser> = {
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name
        };
        
        const success = await updateAdmin(editingAdmin, updateData);
        if (success) {
          showSuccess(
            t('admin.sections.admin_management.messages.update_success_title'),
            t('admin.sections.admin_management.messages.update_success_message', { username: formData.username })
          );
          resetForm();
        } else {
          showError(
            t('admin.sections.admin_management.messages.update_error_title'),
            t('admin.sections.admin_management.messages.update_error_message')
          );
        }
      } else {
        // Agregar nuevo admin
        const success = await addAdmin(formData);
        if (success) {
          showSuccess(
            t('admin.sections.admin_management.messages.create_success_title'),
            t('admin.sections.admin_management.messages.create_success_message', { username: formData.username })
          );
          resetForm();
        } else {
          showError(
            t('admin.sections.admin_management.messages.create_error_title'),
            t('admin.sections.admin_management.messages.create_error_message')
          );
        }
      }
    } catch (error) {
      showError(
        t('admin.sections.admin_management.messages.general_error_title'),
        t('admin.sections.admin_management.messages.general_error_message')
      );
    }
  };

  const handleEdit = (admin: any) => {
    setFormData({
      username: admin.username,
      email: admin.email || '',
      full_name: admin.full_name || '',
      password: ''
    });
    setEditingAdmin(admin.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const admin = admins.find(a => a.id === id);
    if (!admin) return;
    
    // Mostrar notificación de confirmación
    showWarning(
      t('admin.sections.admin_management.messages.delete_confirm_title'),
      t('admin.sections.admin_management.messages.delete_confirm_message', { username: admin.username })
    );
    
    // Simular confirmación automática después de 2 segundos
    // En el futuro esto se puede reemplazar con un modal de confirmación real
    setTimeout(async () => {
      try {
        const success = await deleteAdmin(id);
        if (success) {
          showSuccess(
            t('admin.sections.admin_management.messages.delete_success_title'),
            t('admin.sections.admin_management.messages.delete_success_message', { username: admin.username })
          );
        } else {
          showError(
            t('admin.sections.admin_management.messages.delete_error_title'),
            t('admin.sections.admin_management.messages.delete_error_message')
          );
        }
      } catch (error) {
        showError(
          t('admin.sections.admin_management.messages.general_error_title'),
          t('admin.sections.admin_management.messages.general_error_message')
        );
      }
    }, 2000);
  };

  const handleResetPassword = async (id: number) => {
    const admin = admins.find(a => a.id === id);
    if (!admin) return;
    
    // Contraseña temporal por defecto
    const tempPassword = 'electa1234';
    
    try {
      const success = await resetPassword(id, tempPassword);
      if (success) {
        showSuccess(
          t('admin.sections.admin_management.messages.reset_password_success_title'),
          t('admin.sections.admin_management.messages.reset_password_success_message', { 
            username: admin.username,
            password: tempPassword
          })
        );
      } else {
        showError(
          t('admin.sections.admin_management.messages.reset_password_error_title'),
          t('admin.sections.admin_management.messages.reset_password_error_message')
        );
      }
    } catch (error) {
      showError(
        t('admin.sections.admin_management.messages.general_error_title'),
        t('admin.sections.admin_management.messages.general_error_message')
      );
    }
  };

  const formatDate = (dateString: string) => {
    const currentLang = localStorage.getItem('i18nextLng') || 'es';
    return new Date(dateString).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-white">{t('admin.sections.admin_management.messages.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center py-8">
        {t('admin.sections.admin_management.messages.error_loading')}: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            {t('admin.sections.admin_management.header.title')}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {t('admin.sections.admin_management.header.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          {t('admin.sections.admin_management.header.new_admin')}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-white">
              {editingAdmin ? t('admin.sections.admin_management.form.edit_admin') : t('admin.sections.admin_management.form.new_admin')}
            </h4>
            <button
              onClick={resetForm}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('admin.sections.admin_management.form.username')} *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    errors.username ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder={t('admin.sections.admin_management.form.username_placeholder')}
                />
                {errors.username && (
                  <p className="text-red-400 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('admin.sections.admin_management.form.email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    errors.email ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder={t('admin.sections.admin_management.form.email_placeholder')}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('admin.sections.admin_management.form.full_name')} *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    errors.full_name ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder={t('admin.sections.admin_management.form.full_name_placeholder')}
                />
                {errors.full_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {editingAdmin ? t('admin.sections.admin_management.form.password_optional') : t('admin.sections.admin_management.form.password')} *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    errors.password ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder={editingAdmin ? t('admin.sections.admin_management.form.password_optional_placeholder') : t('admin.sections.admin_management.form.password_placeholder')}
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                {t('admin.sections.admin_management.form.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingAdmin ? t('admin.sections.admin_management.form.update') : t('admin.sections.admin_management.form.create')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Administradores */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left py-3 px-4 text-white font-medium">{t('admin.sections.admin_management.table.username')}</th>
                <th className="text-left py-3 px-4 text-white font-medium">{t('admin.sections.admin_management.table.email')}</th>
                <th className="text-left py-3 px-4 text-white font-medium">{t('admin.sections.admin_management.table.full_name')}</th>
                <th className="text-left py-3 px-4 text-white font-medium">{t('admin.sections.admin_management.table.created')}</th>
                <th className="text-left py-3 px-4 text-white font-medium">{t('admin.sections.admin_management.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-slate-700/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span className="font-medium text-white">{admin.username}</span>
                      {admin.id === 1 && (
                        <span className="px-2 py-1 bg-cyan-500 text-white text-xs rounded-full">
                          {t('admin.sections.admin_management.table.principal')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{admin.email || '-'}</td>
                  <td className="py-3 px-4 text-slate-300">{admin.full_name || '-'}</td>
                  <td className="py-3 px-4 text-sm text-slate-400">
                    {formatDate(admin.created_at)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        title={t('admin.sections.admin_management.actions.edit_title')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      {admin.id !== 1 && (
                        <>
                          <button
                            onClick={() => handleResetPassword(admin.id)}
                            className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                            title={t('admin.sections.admin_management.actions.reset_password_title')}
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(admin.id)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                            title={t('admin.sections.admin_management.actions.delete_title')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
