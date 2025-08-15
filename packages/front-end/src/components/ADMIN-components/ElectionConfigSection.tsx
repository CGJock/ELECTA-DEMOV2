'use client';

import React, { useState } from 'react';
import { Vote, Plus, Settings, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ElectionForm } from './createElection';
import { ActiveElectionSelector } from './setActiveElection';
import { ActiveElectionDisplay } from './activeElectionRead';

interface ElectionConfigSectionProps {
  notifications: {
    showSuccess: (title: string, message: string) => void;
    showError: (title: string, message: string) => void;
  };
}

export default function ElectionConfigSection({ notifications }: ElectionConfigSectionProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('create');

  const tabs = [
    {
      id: 'create',
      name: 'Crear Elección',
      icon: Plus,
      description: 'Crear nueva elección con país, tipo y fecha'
    },
    {
      id: 'active',
      name: 'Elección Activa',
      icon: Settings,
      description: 'Establecer elección activa del sistema'
    },
    {
      id: 'view',
      name: 'Ver Elección Activa',
      icon: Eye,
      description: 'Información de la elección activa actual'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">
          {t('admin.sections.election_config.title') || 'Configuración de Elecciones'}
        </h3>
      </div>

      {/* Tabs de navegación */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        {activeTab === 'create' && (
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Crear Nueva Elección</h4>
            <p className="text-slate-400 mb-6">
              Crea una nueva elección seleccionando el país, tipo de elección, fecha de ronda y número de ronda.
            </p>
            <ElectionForm />
          </div>
        )}

        {activeTab === 'active' && (
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Establecer Elección Activa</h4>
            <p className="text-slate-400 mb-6">
              Selecciona qué elección estará activa en el sistema para mostrar resultados y estadísticas.
            </p>
            <ActiveElectionSelector />
          </div>
        )}

        {activeTab === 'view' && (
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Elección Activa Actual</h4>
            <p className="text-slate-400 mb-6">
              Información detallada de la elección que está actualmente activa en el sistema.
            </p>
            <ActiveElectionDisplay />
          </div>
        )}
      </div>
    </div>
  );
}
