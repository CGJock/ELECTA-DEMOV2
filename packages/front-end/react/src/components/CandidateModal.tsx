"use client"

import { X } from "lucide-react"
import type { PoliticalParty } from "@/types/election"
import { mockParties } from '@data/mockData';
import { useTranslation } from 'react-i18next';


interface CandidateModalProps {
  candidate: PoliticalParty
  isOpen: boolean
  onClose: () => void
}


function useMockCandidateProposals(candidateId: number) {
  const { i18n } = useTranslation();
  const language = i18n.language;
  // Seacrh for the party by candidate ID
  const party = mockParties.find(p => Number(p.candidate.id) === candidateId);
  if (!party) return [];
  // Select proposals based on the current language
  return party.candidate.proposals.map(p => p[language === 'en' ? 'en' : 'es']);
}

export function CandidateModal({ candidate, isOpen, onClose }: CandidateModalProps) {
  // const proposals = useCandidateProposals(Number(candidate.candidate.id)); // TODO: Descomentar para sockets
  const proposals = useMockCandidateProposals(Number(candidate.candidate.id));
  const { t } = useTranslation();
  if (!isOpen) return null

  console.log('[CandidateModal] Render', { candidate, proposals });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Backdrop */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div style={{
        position: 'relative',
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        backdropFilter: 'blur(12px)',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        margin: '0 16px',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: '#94a3b8',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
        >
          <X size={24} />
        </button>

        {/* Candidate photo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '128px',
            height: '128px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid #475569'
          }}>
            <img
              src={candidate.candidate.photo}
              alt={candidate.candidate.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Candidate info */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
            {candidate.candidate.name}
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#cbd5e1', marginBottom: '4px' }}>
            {candidate.candidate.age} {t('candidate.age')}
          </p>
          <p style={{ color: '#94a3b8', marginBottom: '12px' }}>
            {candidate.candidate.education.es}
          </p>
          <div 
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: candidate.color + '20',
              color: candidate.color
            }}
          >
            {candidate.name} ({candidate.abbreviation})
          </div>
        </div>

        {/* Experience */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
            {t('candidate.experience')}
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.6' }}>
            {candidate.candidate.experience.es}
          </p>
        </div>

        {/* Proposals */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
            {t('candidate.main_proposals')}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {proposals.length === 0 ? (
              <li style={{ color: '#94a3b8', fontStyle: 'italic' }}>{t('candidate.no_proposals')}</li>
            ) : (
              proposals.map((proposal, index) => (
                <li key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <div 
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      marginTop: '8px',
                      flexShrink: 0,
                      backgroundColor: candidate.color
                    }}
                  />
                  <span style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.6' }}>
                    {proposal}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

      </div>
    </div>
  )
} 