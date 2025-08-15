'use client';

import React from 'react';
import { 
  Settings, 
  Layers, 
  Vote, 
  Shield, 
  Users,
  LogOut,
  Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/authContext';

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({ 
  activeSection, 
  setActiveSection, 
  sidebarOpen, 
  setSidebarOpen 
}: AdminSidebarProps) {
  const { t, i18n } = useTranslation();
  const { admin, logout } = useAuth();

  // Configuración del sidebar
  const sidebarItems = [
    {
      id: 'site-control',
      name: t('admin.sections.site_control.title'),
      icon: Settings,
      description: t('admin.sections.site_control.description')
    },
    {
      id: 'component-visibility',
      name: t('admin.sections.component_visibility.title'),
      icon: Layers,
      description: t('admin.sections.component_visibility.description')
    },
    {
      id: 'election-config',
      name: t('admin.sections.election_config.title'),
      icon: Vote,
      description: t('admin.sections.election_config.description')
    },
    {
      id: 'whitelist-management',
      name: t('admin.sections.whitelist_management.title'),
      icon: Users,
      description: t('admin.sections.whitelist_management.description')
    },
    {
      id: 'admin-management',
      name: t('admin.sections.admin_management.title'),
      icon: Shield,
      description: t('admin.sections.admin_management.description')
    }
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header del sidebar */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-cyan-400">ELECTA</h1>
          <p className="text-sm text-slate-400 mt-3">{t('admin.version')}</p>
          
          {/* Toggle de Idioma */}
          <div className="mt-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')}
              className="text-xs text-slate-300 hover:text-cyan-400 transition-colors px-2 py-1 rounded border border-slate-600 hover:border-cyan-500"
            >
              {i18n.language === 'es' ? 'EN' : 'ES'}
            </button>
          </div>
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
  );
}
