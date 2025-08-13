"use client"

import { useState, useEffect, useRef } from "react"
import { AlertTriangle, X, Clock, MapPin, Settings, Languages } from "lucide-react"
import type { Incident } from '@/types/election';
import { mockIncidents } from '@data/mockIncidents';
import { useTranslation } from 'react-i18next'
import TranslationConfig from './TranslationConfig';
import { useTranslationService } from '@/hooks/useTranslationService';

interface IncidentsFlagProps {
  incidents?: Incident[]
  onIncidentsChange?: (incidents: Incident[]) => void
  isOpen?: boolean;
  focusedIncidentId?: string;
  hideButton?: boolean;
  onClose?: () => void;
}

// Mock socket functions for demo purposes
const getSocket = () => ({
  on: (event: string, callback: (data: any) => void) => {
    // Mock socket listener
    console.log(`Mock socket listening for: ${event}`)
  },
  off: (event: string) => {
    // Mock socket cleanup
    console.log(`Mock socket stopped listening for: ${event}`)
  }
})

const emitIncidentUpdate = (incident: Incident) => {
  // Mock socket emit
  console.log('Mock socket emitting incident:', incident)
}

// NUEVO: sistema de status de incidentes con colores
const incidentStatus: Record<string, string> = {
  stuck: '#ef4444',      // ongoing/stuck incidents (rojo)
  new: '#2563eb',        // newly reported incidents (azul)
  resolved: '#22c55e'    // completed/resolved incidents (verde)
}

export function IncidentsFlag({ incidents: initialIncidents = mockIncidents, onIncidentsChange, isOpen: isOpenProp, focusedIncidentId, hideButton = false, onClose }: IncidentsFlagProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents)
  const [mounted, setMounted] = useState(false)
  const [showTranslationConfig, setShowTranslationConfig] = useState(false)
  const { t, i18n } = useTranslation();

  // Hook para el servicio de traducción
  const { isConfigured: isTranslationConfigured } = useTranslationService();

  // Nuevo: refs para incidentes
  const incidentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const socket = getSocket()
    
    // Listen for incident updates
    socket.on('incident_update', (data: Incident) => {
      setIncidents(prev => {
        const existing = prev.find(i => i.id === data.id)
        if (existing) {
          const updated = prev.map(i => i.id === data.id ? data : i)
          onIncidentsChange?.(updated)
          return updated
        }
        const newIncidents = [...prev, data]
        onIncidentsChange?.(newIncidents)
        return newIncidents
      })
    })

    return () => {
      socket.off('incident_update')
    }
  }, [mounted, onIncidentsChange])

  // Sync with external props
  useEffect(() => {
    if (mounted) {
      setIncidents(initialIncidents)
    }
  }, [initialIncidents, mounted])

  // Sincronizar apertura externa
  useEffect(() => {
    if (typeof isOpenProp === 'boolean') setIsOpen(isOpenProp);
  }, [isOpenProp]);

  useEffect(() => {
    if (focusedIncidentId && incidentRefs.current[focusedIncidentId]) {
      incidentRefs.current[focusedIncidentId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusedIncidentId, isOpen]);

  const handleAddIncident = (incident: Omit<Incident, 'id' | 'timestamp'>) => {
    const newIncident: Incident = {
      ...incident,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }
    
    emitIncidentUpdate(newIncident)
    setIncidents(prev => {
      const updated = [...prev, newIncident]
      onIncidentsChange?.(updated)
      return updated
    })
  }

  // Elimina getSeverityColor y reemplaza por getStatusColor
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stuck':
        return 'text-red-400 bg-red-500/20';
      case 'new':
        return 'text-blue-400 bg-blue-500/20';
      case 'resolved':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  }

  // NUEVO: función para el color del círculo del botón basada en status
  function getFlagColor(incidents: Incident[]): string {
    if (incidents.some((i: Incident) => i.status === 'stuck')) return incidentStatus.stuck;
    if (incidents.some((i: Incident) => i.status === 'new')) return incidentStatus.new;
    return incidentStatus.resolved;
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!mounted) return null;

  return (
    <>
      {/* Solo muestro el botón si el modal NO está abierto y hideButton es false */}
      {(!hideButton && !isOpen) && (
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #2563EB 100%)',
              color: '#E0FFE6',
              padding: '1.2rem 0.4rem',
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px',
              border: '2px solid #10B981',
              borderRight: 'none',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.18)',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.3rem',
              minWidth: '44px',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              cursor: 'pointer',
              width: '44px',
              maxWidth: '44px',
            }}
            className="sm:w-[44px] sm:max-w-[44px] sm:p-1 sm:gap-1 sm:min-w-0 sm:writing-mode-initial sm:text-orientation-initial group"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #10B981 0%, #34D399 100%)';
              e.currentTarget.style.color = '#0F172A';
              e.currentTarget.style.border = '2px solid #10B981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #10B981 0%, #2563EB 100%)';
              e.currentTarget.style.color = '#E0FFE6';
              e.currentTarget.style.border = '2px solid #10B981';
            }}
            aria-label={t('incidents.reports')}
            title={t('incidents.reports')}
          >
            <AlertTriangle size={18} />
            {/* Solo muestra el texto en desktop */}
            <span className="hidden md:inline" style={{ fontWeight: 'bold', fontSize: '0.7rem' }}>{t('incidents.reports')}</span>
            {incidents.length > 0 && (
              <span style={{
                background: getFlagColor(incidents),
                color: '#fff',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                marginTop: '2px',
              }}>
                {incidents.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Incidents Panel */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-full z-50">
          <div style={{
            width: '384px',
            height: '100%',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderLeft: '2px solid #374151',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              padding: '1rem',
              borderBottom: '2px solid #374151',
              background: 'rgba(51, 65, 85, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 'bold',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertTriangle style={{ color: '#10B981' }} size={20} />
                <span>{t('incidents.reports')}</span>
                {isTranslationConfigured && (
                  <Languages 
                    className="text-cyan-400" 
                    size={16} 
                  />
                )}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Botón de configuración de traducción */}
                <button
                  onClick={() => setShowTranslationConfig(true)}
                  style={{
                    color: '#64748B',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                    padding: '0.25rem',
                    borderRadius: '0.25rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#22D3EE'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                  title="Configurar traducción automática"
                >
                  <Settings size={16} />
                </button>
                {/* Botón de cerrar */}
                <button 
                  onClick={handleClose} 
                  style={{
                    color: '#64748B',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: 0,
              justifyContent: 'space-between',
            }}>
              <div style={{
                overflowY: 'auto',
                flex: 1,
                minHeight: 0,
                paddingBottom: 0,
              }}>
                {incidents.length === 0 ? (
                  <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#64748B'
                  }}>
                    <AlertTriangle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>{t('incidents.no_incidents')}</p>
                  </div>
                ) : (
                  <div style={{
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    {incidents.map((incident) => (
                      <div
                        key={incident.id}
                        ref={el => { incidentRefs.current[incident.id] = el; }}
                        style={{
                          background: incident.id === focusedIncidentId ? 'rgba(239,68,68,0.25)' : 'rgba(51, 65, 85, 0.3)',
                          borderRadius: '12px',
                          padding: '1rem',
                          border: incident.id === focusedIncidentId ? '2px solid #ef4444' : '2px solid #374151',
                          boxShadow: incident.id === focusedIncidentId ? '0 0 0 2px #ef4444' : undefined,
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = incident.id === focusedIncidentId ? '2px solid #ef4444' : '2px solid #10B981';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.border = incident.id === focusedIncidentId ? '2px solid #ef4444' : '2px solid #374151';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <AlertTriangle style={{ color: '#facc15' }} size={18} />
                          <span style={{ fontWeight: 'bold', color: '#fff' }}>{incident.title[i18n.language as 'es' | 'en'] || incident.title['es']}</span>
                          <span className={getStatusColor(incident.status)} style={{ fontSize: '0.8rem', marginLeft: 'auto' }}>{t(`incidents.status_${incident.status}`)}</span>
                        </div>
                        <div style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{incident.description[i18n.language as 'es' | 'en'] || incident.description['es']}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                          <MapPin size={14} /> {incident.location[i18n.language as 'es' | 'en'] || incident.location['es']}
                          <Clock size={14} style={{ marginLeft: '1rem' }} /> {formatTime(incident.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Disclaimer */}
              <div style={{
                fontSize: '0.68rem',
                color: '#64748B',
                textAlign: 'center',
                padding: '0.7rem 1.2rem 1.2rem 1.2rem',
                lineHeight: 1.4,
                borderTop: '1px solid #374151',
                background: 'rgba(30,41,59,0.92)',
                width: '100%',
              }}>
                {t('incidents.disclaimer')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de configuración de traducción */}
      <TranslationConfig 
        isOpen={showTranslationConfig} 
        onClose={() => setShowTranslationConfig(false)} 
      />
    </>
  )
} 