'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Layers, 
  Vote, 
  Menu, 
  X, 
  Shield, 
  Globe, 
  Code, 
  FileText,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Save,
  LogOut
} from 'lucide-react';
import { useMaintenance } from '@/hooks/useMaintenance';
import { useTranslation } from 'react-i18next';
import { useComponentSelector } from '@/hooks/useComponentSelector';
import { useElectionManager } from '@/hooks/useElectionManager';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationToast from '@/components/NotificationToast';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { useAuth } from '@/context/authContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAdminManagement } from '@/context/adminManagementContext';
import AdminManagement from '@/components/AdminManagement';
import { ActiveElectionDisplay } from '@/components/activeElectionRead';


export default function AdminPage() {
  // Hook de traducción
  const { t, i18n } = useTranslation();
  
  // Hook de autenticación
  const { admin, logout } = useAuth();
  
  // Estado para el sidebar móvil
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Estado para la sección activa
  const [activeSection, setActiveSection] = useState('site-control');
  
  // Hook para manejo de mantenimiento
  const { 
    isMaintenanceMode, 
    isPrivateAccess, 
    setMaintenanceMode, 
    setPrivateAccess 
  } = useMaintenance();
  
  // Hook para configuración del sitio
  const {
    config: siteConfig,
    errors: siteErrors,
    updateConfig: updateSiteConfig,
    saveConfig: saveSiteConfig
  } = useSiteConfig();

  // Hook para selector de componentes
  const {
    activePhase,
    setActivePhase,
    phaseConfig,
    toggleComponentVisibility,
    saveConfiguration,
    applyToSite,
    getVisibleComponentsCount,
    getTotalComponentsCount,
    getActivePhaseName,
    getActivePhaseComponents
  } = useComponentSelector();

  // Hook para manejo de elecciones
  const {
    elections,
    editingElection,
    showElectionForm,
    errors: electionErrors,
    createElection,
    updateElection,
    deleteElection,
    activateElection,
    deactivateElection,
    openEditForm,
    closeForm,
    setShowElectionForm,
    clearFieldError
  } = useElectionManager();

  // Hook para notificaciones
  const {
    notifications,
    removeNotification,
    showSuccess,
    showError,
    showWarning
  } = useNotifications();

  // Estados para el formulario de elección
  const [newElection, setNewElection] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    totalVoters: 0
  });

  // Estado para el diálogo de confirmación
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Sincronizar formulario cuando se edita una elección
  useEffect(() => {
    if (editingElection) {
      setNewElection({
        name: editingElection.name,
        description: editingElection.description,
        startDate: editingElection.startDate,
        endDate: editingElection.endDate,
        totalVoters: editingElection.totalVoters
      });
    } else {
      setNewElection({ name: '', description: '', startDate: '', endDate: '', totalVoters: 0 });
    }
  }, [editingElection]);

  // Funciones para Selector de Componentes
  const handleSaveConfiguration = () => {
    if (!activePhase) {
      showError('Error', 'Debes seleccionar una fase primero');
      return;
    }
    
    const success = saveConfiguration();
    if (success) {
      const phaseName = activePhase === 'before' ? 'Antes' : 
                       activePhase === 'during' ? 'Durante' : 'Después';
      showSuccess('Configuración Guardada', `Configuración guardada para la fase: ${phaseName}`);
    }
  };

  const handleApplyToSite = () => {
    if (!activePhase) {
      showError('Error', 'Debes seleccionar una fase primero');
      return;
    }
    
    const success = applyToSite();
    if (success) {
      const phaseName = activePhase === 'before' ? 'Antes' : 
                       activePhase === 'during' ? 'Durante' : 'Después';
      showSuccess('Configuración Aplicada', `Configuración aplicada al sitio para la fase: ${phaseName}`);
    }
  };

  // Funciones para Configuración de Elecciones
  const handleCreateElection = () => {
    const success = createElection({
      name: newElection.name,
      description: newElection.description,
      startDate: newElection.startDate,
      endDate: newElection.endDate,
      totalVoters: newElection.totalVoters
    });

    if (success) {
      showSuccess('Elección Creada', 'La elección se ha creado exitosamente');
    } else {
      showError('Error de Validación', 'Por favor revisa los campos del formulario');
    }
  };

  const handleUpdateElection = () => {
    if (!editingElection) return;

    const success = updateElection(editingElection.id, {
      name: newElection.name,
      description: newElection.description,
      startDate: newElection.startDate,
      endDate: newElection.endDate,
      totalVoters: newElection.totalVoters
    });

    if (success) {
      showSuccess('Elección Actualizada', 'La elección se ha actualizado exitosamente');
    } else {
      showError('Error de Validación', 'Por favor revisa los campos del formulario');
    }
  };

  const handleDeleteElection = (id: number) => {
    const election = elections.find(e => e.id === id);
    if (!election) return;

    setConfirmationDialog({
      isOpen: true,
      title: 'Confirmar Eliminación',
      message: `¿Estás seguro de que quieres eliminar la elección "${election.name}"? Esta acción no se puede deshacer.`,
      onConfirm: () => {
        deleteElection(id);
        setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
        showSuccess('Elección Eliminada', 'La elección se ha eliminado exitosamente');
      }
    });
  };

  // Función para guardar configuración del sitio
  const handleSaveSiteConfig = () => {
    const success = saveSiteConfig();
    if (success) {
      showSuccess('Configuración Guardada', 'La configuración del sitio se ha guardado exitosamente');
    } else {
      showError('Error de Validación', 'Por favor revisa los campos del formulario');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'upcoming': return 'text-blue-400';
      case 'inactive': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('admin.sections.election_config.status.active');
      case 'upcoming': return t('admin.sections.election_config.status.upcoming');
      case 'inactive': return t('admin.sections.election_config.status.inactive');
      default: return t('admin.sections.election_config.status.unknown');
    }
  };

  // Configuración del sidebar
  const sidebarItems = [
    {
      id: 'site-control',
      name: t('admin.sections.site_control.title'),
      icon: Settings,
      description: t('admin.sections.site_control.description')
    },
    {
      id: 'component-selector',
      name: t('admin.sections.component_selector.title'),
      icon: Layers,
      description: t('admin.sections.component_selector.description')
    },
    {
      id: 'election-config',
      name: t('admin.sections.election_config.title'),
      icon: Vote,
      description: t('admin.sections.election_config.description')
    },
    {
      id: 'admin-management',
      name: t('admin.sections.admin_management.title'),
      icon: Shield,
      description: t('admin.sections.admin_management.description')
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'site-control':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                {t('admin.sections.site_control.general_status')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">{t('admin.sections.site_control.maintenance_mode')}</h4>
                    <p className="text-sm text-slate-400">{t('admin.sections.site_control.maintenance_description')}</p>
                  </div>
                  <button
                    onClick={() => setMaintenanceMode(!isMaintenanceMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isMaintenanceMode ? 'bg-red-500' : 'bg-slate-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isMaintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">{t('admin.sections.site_control.private_access')}</h4>
                    <p className="text-sm text-slate-400">{t('admin.sections.site_control.private_description')}</p>
                  </div>
                  <button
                    onClick={() => setPrivateAccess(!isPrivateAccess)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isPrivateAccess ? 'bg-cyan-500' : 'bg-slate-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPrivateAccess ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-400" />
                {t('admin.sections.site_control.access_config')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('admin.sections.site_control.access_code')}
                  </label>
                  <input
                    type="text"
                    value={siteConfig.accessCode}
                    onChange={(e) => updateSiteConfig({ accessCode: e.target.value })}
                    placeholder={t('admin.sections.site_control.access_code_placeholder')}
                    className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      siteErrors.accessCode ? 'border-red-500' : 'border-slate-600'
                    }`}
                  />
                  {siteErrors.accessCode && (
                    <p className="text-red-400 text-sm mt-1">{siteErrors.accessCode}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('admin.sections.site_control.terms_message')}
                  </label>
                  <textarea
                    value={siteConfig.termsMessage}
                    onChange={(e) => updateSiteConfig({ termsMessage: e.target.value })}
                    placeholder={t('admin.sections.site_control.terms_placeholder')}
                    rows={3}
                    className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      siteErrors.termsMessage ? 'border-red-500' : 'border-slate-600'
                    }`}
                  />
                  {siteErrors.termsMessage && (
                    <p className="text-red-400 text-sm mt-1">{siteErrors.termsMessage}</p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSaveSiteConfig}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {t('admin.sections.site_control.save_config')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'component-selector':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                {t('admin.sections.component_selector.phase_selector')}
              </h3>
              
              <div className="flex gap-2 mb-6">
                {(['before', 'during', 'after'] as const).map((phase) => (
                  <button
                    key={phase}
                    onClick={() => setActivePhase(phase)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activePhase === phase
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {phase === 'before' ? t('admin.sections.component_selector.before') : 
                     phase === 'during' ? t('admin.sections.component_selector.during') : 
                     t('admin.sections.component_selector.after')}
                  </button>
                ))}
              </div>

              {activePhase && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h4 className="font-medium text-white mb-2">
                      {t('admin.sections.component_selector.active_phase')}: {getActivePhaseName()}
                    </h4>
                    <p className="text-sm text-slate-400">
                      {t('admin.sections.component_selector.active_phase_description')}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-4">
                      {t('admin.sections.component_selector.visible_components')} - {getActivePhaseName()}
                    </h4>
                    <p className="text-sm text-slate-400 mb-4">
                      Componentes visibles: {getVisibleComponentsCount()}/{getTotalComponentsCount()}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {getActivePhaseComponents().map((component) => (
                        <div
                          key={component.id}
                          className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                        >
                          <span className="text-white text-sm">{component.name}</span>
                          <button
                            onClick={() => toggleComponentVisibility(component.id)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              component.visible
                                ? 'bg-green-500 text-white'
                                : 'bg-slate-600 text-slate-300'
                            }`}
                          >
                            {component.visible ? t('admin.sections.component_selector.visible') : t('admin.sections.component_selector.hidden')}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveConfiguration}
                      className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                    >
                      {t('admin.sections.component_selector.save_config')}
                    </button>
                    <button
                      onClick={handleApplyToSite}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      {t('admin.sections.component_selector.apply_site')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'election-config':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                {t('admin.sections.election_config.title')}
              </h3>
              <button
                onClick={() => setShowElectionForm(true)}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('admin.sections.election_config.new_election')}
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-white font-medium">
                        {t('admin.sections.election_config.election_table.election')}
                      </th>
                      <th className="text-left py-3 px-4 text-white font-medium">
                        {t('admin.sections.election_config.election_table.status')}
                      </th>
                      <th className="text-left py-3 px-4 text-white font-medium">
                        {t('admin.sections.election_config.election_table.dates')}
                      </th>
                      <th className="text-left py-3 px-4 text-white font-medium">
                        {t('admin.sections.election_config.election_table.votes')}
                      </th>
                      <th className="text-left py-3 px-4 text-white font-medium">
                        {t('admin.sections.election_config.election_table.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {elections.map((election) => (
                      <tr key={election.id} className="border-b border-slate-700/50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-white">{election.name}</div>
                            <div className="text-sm text-slate-400">{election.description}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(election.status)}`}>
                            {getStatusText(election.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300">
                          <div>{t('admin.sections.election_config.form.start_date')}: {election.startDate}</div>
                          <div>{t('admin.sections.election_config.form.end_date')}: {election.endDate}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300">
                          {election.votes} / {election.totalVoters}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditForm(election)}
                              className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                              title={t('admin.sections.election_config.actions.edit')}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {election.status === 'active' ? (
                              <button
                                onClick={() => deactivateElection(election.id)}
                                className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                                title={t('admin.sections.election_config.actions.deactivate')}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => activateElection(election.id)}
                                className="p-2 text-green-400 hover:text-green-300 transition-colors"
                                title={t('admin.sections.election_config.actions.activate')}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteElection(election.id)}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors"
                              title={t('admin.sections.election_config.actions.delete')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Formulario de Elección */}
            {showElectionForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {editingElection ? t('admin.sections.election_config.form.edit_election') : t('admin.sections.election_config.form.create_election')}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        {t('admin.sections.election_config.form.election_name')}
                      </label>
                      <input
                        type="text"
                        value={newElection.name}
                        onChange={(e) => {
                          setNewElection(prev => ({ ...prev, name: e.target.value }));
                          clearFieldError('name');
                        }}
                        placeholder={t('admin.sections.election_config.form.election_name_placeholder')}
                        className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          electionErrors.name ? 'border-red-500' : 'border-slate-600'
                        }`}
                      />
                      {electionErrors.name && (
                        <p className="text-red-400 text-sm mt-1">{electionErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        {t('admin.sections.election_config.form.description')}
                      </label>
                      <textarea
                        value={newElection.description}
                        onChange={(e) => {
                          setNewElection(prev => ({ ...prev, description: e.target.value }));
                          clearFieldError('description');
                        }}
                        placeholder={t('admin.sections.election_config.form.description_placeholder')}
                        rows={3}
                        className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          electionErrors.description ? 'border-red-500' : 'border-slate-600'
                        }`}
                      />
                      {electionErrors.description && (
                        <p className="text-red-400 text-sm mt-1">{electionErrors.description}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          {t('admin.sections.election_config.form.start_date')}
                        </label>
                        <input
                          type="date"
                          value={newElection.startDate}
                          onChange={(e) => {
                            setNewElection(prev => ({ ...prev, startDate: e.target.value }));
                            clearFieldError('startDate');
                          }}
                          className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            electionErrors.startDate ? 'border-red-500' : 'border-slate-600'
                          }`}
                        />
                        {electionErrors.startDate && (
                          <p className="text-red-400 text-sm mt-1">{electionErrors.startDate}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          {t('admin.sections.election_config.form.end_date')}
                        </label>
                        <input
                          type="date"
                          value={newElection.endDate}
                          onChange={(e) => {
                            setNewElection(prev => ({ ...prev, endDate: e.target.value }));
                            clearFieldError('endDate');
                          }}
                          className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            electionErrors.endDate ? 'border-red-500' : 'border-slate-600'
                          }`}
                        />
                        {electionErrors.endDate && (
                          <p className="text-red-400 text-sm mt-1">{electionErrors.endDate}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        {t('admin.sections.election_config.form.total_voters')}
                      </label>
                      <input
                        type="number"
                        value={newElection.totalVoters}
                        onChange={(e) => {
                          setNewElection(prev => ({ ...prev, totalVoters: parseInt(e.target.value) || 0 }));
                          clearFieldError('totalVoters');
                        }}
                        placeholder={t('admin.sections.election_config.form.total_voters_placeholder')}
                        className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          electionErrors.totalVoters ? 'border-red-500' : 'border-slate-600'
                        }`}
                      />
                      {electionErrors.totalVoters && (
                        <p className="text-red-400 text-sm mt-1">{electionErrors.totalVoters}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={closeForm}
                      className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      {t('admin.sections.election_config.form.cancel')}
                    </button>
                    <button
                      onClick={editingElection ? handleUpdateElection : handleCreateElection}
                      className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                    >
                      {editingElection ? t('admin.sections.election_config.form.update_election') : t('admin.sections.election_config.form.create_election_button')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'admin-management':
        return <AdminManagement notifications={{ showSuccess, showError, showWarning }} />;
        
      default:
        return null;
    }
  };

  // Función para cambiar idioma
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Header móvil */}
        <div className="lg:hidden bg-slate-800 border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-cyan-400">ELECTA</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="flex flex-col h-full">
              {/* Header del sidebar */}
              <div className="p-6 border-b border-slate-700">
                <h1 className="text-2xl font-bold text-cyan-400">ELECTA</h1>
                <p className="text-sm text-slate-400 mt-3">{t('admin.version')}</p>
              </div>

              {/* Navegación */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {sidebarItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveSection(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          activeSection === item.id
                            ? 'bg-cyan-500 text-white'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs opacity-75">{item.description}</div>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer del sidebar */}
              <div className="p-4 border-t border-slate-700">
                <div className="text-center">
                  <p className="text-xs text-slate-400">{t('admin.subtitle')}</p>
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <div className="text-sm text-slate-300 mb-2">
                      {t('admin.sidebar.connected_as')} <span className="text-cyan-400">{admin?.username}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('admin.sidebar.logout')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{t('admin.title')}</h1>
                  <p className="text-slate-400">{t('admin.subtitle')}</p>
                </div>
                
                {/* Toggle de idioma en la esquina superior derecha */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-300 font-medium">ES</span>
                  <button
                    onClick={toggleLanguage}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      i18n.language === 'es' ? 'bg-cyan-500' : 'bg-slate-600'
                    }`}
                    title={i18n.language === 'en' ? t('admin.language_toggle.change_to_spanish') : t('admin.language_toggle.change_to_english')}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      i18n.language === 'es' ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                  <span className="text-sm text-slate-300 font-medium">EN</span>
                </div>
              </div>

              {renderSectionContent()}
            </div>
          </div>
        </div>

        {/* Overlay para cerrar sidebar en móvil */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Notificaciones */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onClose={removeNotification}
            />
          ))}
        </div>

        {/* Diálogo de confirmación */}
        <ConfirmationDialog
          isOpen={confirmationDialog.isOpen}
          title={confirmationDialog.title}
          message={confirmationDialog.message}
          onConfirm={confirmationDialog.onConfirm}
          onCancel={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}
          type="danger"
        />
      </div>
    </ProtectedRoute>
  );
}
