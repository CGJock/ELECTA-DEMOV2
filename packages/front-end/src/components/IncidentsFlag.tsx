"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X, Clock, MapPin } from "lucide-react"
import type { Incident } from "../types/election"
import { mockIncidents } from "../data/mockIncidents"
import { useTranslation } from 'react-i18next'

interface IncidentsFlagProps {
  incidents?: Incident[]
  onIncidentsChange?: (incidents: Incident[]) => void
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

export function IncidentsFlag({ incidents: initialIncidents = mockIncidents, onIncidentsChange }: IncidentsFlagProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents)
  const [mounted, setMounted] = useState(false)
  const { t, i18n } = useTranslation();

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
//Rate the severity of the incident and return a corresponding color class
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-orange-400 bg-orange-500/20"
      case "medium":
        return "text-blue-400 bg-blue-500/20"
      case "low":
        return "text-green-400 bg-green-500/20"
      default:
        return "text-gray-400 bg-gray-500/20"
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Flag Button */}
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
            cursor: 'pointer'
          }}
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
        >
          <AlertTriangle size={18} />
          <span style={{ fontWeight: 'bold', fontSize: '0.7rem' }}>{t('incidents.title')}</span>
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
              fontWeight: 'bold'
            }}>
              {incidents.length}
            </span>
          )}
        </button>
      </div>

      {/* Incidents Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="flex-1 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
          />

          {/* Panel */}
          <div style={{
            width: '384px',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderLeft: '2px solid #374151',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden'
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
              </h3>
              <button 
                onClick={() => setIsOpen(false)} 
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

            <div style={{
              overflowY: 'auto',
              height: 'calc(100vh - 80px)',
              paddingBottom: '5rem'
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
                      style={{
                        background: 'rgba(51, 65, 85, 0.3)',
                        borderRadius: '12px',
                        padding: '1rem',
                        border: '2px solid #374151',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.border = '2px solid #10B981';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.border = '2px solid #374151';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <AlertTriangle style={{ color: '#facc15' }} size={18} />
                        <span style={{ fontWeight: 'bold', color: '#fff' }}>{incident.title[i18n.language as 'es' | 'en'] || incident.title['es']}</span>
                        <span className={getSeverityColor(incident.severity)} style={{ fontSize: '0.8rem', marginLeft: 'auto' }}>{t(`incidents.severity_${incident.severity}`)}</span>
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
          </div>
        </div>
      )}
    </>
  )
}

function getFlagColor(incidents: Incident[]): string {
  if (incidents.some((i: Incident) => i.severity === 'high')) return '#ef4444';
  if (incidents.some((i: Incident) => i.severity === 'medium')) return '#facc15';
  return '#22c55e';
} 