'use client';

import React from 'react';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMaintenance } from '@/hooks/useMaintenance';

interface SiteControlSectionProps {
  notifications: {
    showSuccess: (title: string, message: string) => void;
    showError: (title: string, message: string) => void;
  };
}

export default function SiteControlSection({ notifications }: SiteControlSectionProps) {
  const { t } = useTranslation();
  
  const { 
    isMaintenanceMode, 
    isPrivateAccess, 
    setMaintenanceMode, 
    setPrivateAccess 
  } = useMaintenance();

  return (
    <div className="space-y-6">
      {/* Estado General */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          {t('admin.sections.site_control.general_status')}
        </h3>
        
        <div className="space-y-4">
          {/* Modo Mantenimiento */}
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

          {/* Acceso Privado */}
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
    </div>
  );
}
