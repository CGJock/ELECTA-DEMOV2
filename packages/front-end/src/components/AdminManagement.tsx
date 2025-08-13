'use client';

import React, { useState } from 'react';
import { useAdminManagement } from '@/context/adminManagementContext';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus, 
  Users, 
  Shield, 
  CheckCircle, 
  XCircle,
  Save,
  X
} from 'lucide-react';

interface AdminFormData {
  username: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface NotificationFunctions {
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
}

interface AdminManagementProps {
  notifications: NotificationFunctions;
}

const AdminManagement: React.FC<AdminManagementProps> = ({ notifications }) => {
  const { t } = useTranslation();
  const { admins, addAdmin, updateAdmin, deleteAdmin, toggleAdminStatus } = useAdminManagement();
  const { showSuccess, showError, showWarning } = notifications;
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<number | null>(null);
  const [formData, setFormData] = useState<AdminFormData>({
    username: '',
    email: '',
    role: '',
    isActive: true
  });
  const [errors, setErrors] = useState<Partial<AdminFormData>>({});

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      role: '',
      isActive: true
    });
    setErrors({});
    setEditingAdmin(null);
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!formData.role.trim()) {
      newErrors.role = t('admin.sections.admin_management.form.role_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (editingAdmin) {
      // Actualizar admin existente
      const success = updateAdmin(editingAdmin, formData);
      if (success) {
        showSuccess(
          t('admin.sections.admin_management.update_success_title'),
          t('admin.sections.admin_management.update_success_message', { username: formData.username })
        );
        resetForm();
      } else {
        showError(
          t('admin.sections.admin_management.update_error_title'),
          t('admin.sections.admin_management.update_error_message')
        );
      }
    } else {
      // Agregar nuevo admin
      const success = addAdmin(formData);
      if (success) {
        showSuccess(
          t('admin.sections.admin_management.create_success_title'),
          t('admin.sections.admin_management.create_success_message', { username: formData.username })
        );
        resetForm();
      } else {
        showError(
          t('admin.sections.admin_management.create_error_title'),
          t('admin.sections.admin_management.create_error_message')
        );
      }
    }
  };

  const handleEdit = (admin: any) => {
    setFormData({
      username: admin.username,
      email: admin.email || '',
      role: admin.role || '',
      isActive: admin.isActive
    });
    setEditingAdmin(admin.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    const admin = admins.find(a => a.id === id);
    if (!admin) return;
    
    // Mostrar notificación de confirmación
    showWarning(
      t('admin.sections.admin_management.delete_confirm_title'),
      t('admin.sections.admin_management.delete_confirm_message', { username: admin.username })
    );
    
    // Simular confirmación automática después de 2 segundos
    // En el futuro esto se puede reemplazar con un modal de confirmación real
    setTimeout(() => {
      const success = deleteAdmin(id);
      if (success) {
        showSuccess(
          t('admin.sections.admin_management.delete_success_title'),
          t('admin.sections.admin_management.delete_success_message', { username: admin.username })
        );
      } else {
        showError(
          t('admin.sections.admin_management.delete_error_title'),
          t('admin.sections.admin_management.delete_error_message')
        );
      }
    }, 2000);
  };

  const handleToggleStatus = (id: number) => {
    const admin = admins.find(a => a.id === id);
    if (!admin) return;
    
    const success = toggleAdminStatus(id);
    if (success) {
      const newStatus = !admin.isActive;
      showSuccess(
        t('admin.sections.admin_management.status_change_success_title'),
        t('admin.sections.admin_management.status_change_success_message', { 
          username: admin.username,
          status: newStatus ? t('admin.sections.admin_management.table.active') : t('admin.sections.admin_management.table.inactive')
        })
      );
    } else {
      showError(
        t('admin.sections.admin_management.status_change_error_title'),
        t('admin.sections.admin_management.status_change_error_message')
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
                  {t('admin.sections.admin_management.form.role')} *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    errors.role ? 'border-red-500' : 'border-slate-600'
                  }`}
                >
                  <option value="">{t('admin.sections.admin_management.form.role_placeholder')}</option>
                  <option value="Super Admin">{t('admin.sections.admin_management.roles.super_admin')}</option>
                  <option value="Admin">{t('admin.sections.admin_management.roles.admin')}</option>
                  <option value="Moderador">{t('admin.sections.admin_management.roles.moderator')}</option>
                  <option value="Editor">{t('admin.sections.admin_management.roles.editor')}</option>
                </select>
                {errors.role && (
                  <p className="text-red-400 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-white">{t('admin.sections.admin_management.form.is_active')}</span>
                </label>
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
                <th className="text-left py-3 px-4 text-white font-medium">{t('admin.sections.admin_management.table.role')}</th>
                <th className="text-left py-3 px-4 text-white font-medium">{t('admin.sections.admin_management.table.status')}</th>
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
                  <td className="py-3 px-4 text-slate-300">{admin.role || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      admin.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {admin.isActive ? (
                                                 <>
                           <CheckCircle className="w-3 h-3 mr-1" />
                           {t('admin.sections.admin_management.table.active')}
                         </>
                       ) : (
                         <>
                           <XCircle className="w-3 h-3 mr-1" />
                           {t('admin.sections.admin_management.table.inactive')}
                         </>
                       )}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-400">
                    {formatDate(admin.createdAt)}
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
                                   onClick={() => handleToggleStatus(admin.id)}
                                   className={`p-2 transition-colors ${
                                     admin.isActive
                                       ? 'text-yellow-400 hover:text-yellow-300'
                                       : 'text-green-400 hover:text-green-300'
                                   }`}
                                   title={admin.isActive ? t('admin.sections.admin_management.actions.deactivate_title') : t('admin.sections.admin_management.actions.activate_title')}
                                 >
                                   {admin.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
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
