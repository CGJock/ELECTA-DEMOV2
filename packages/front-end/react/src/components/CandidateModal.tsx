"use client"

import { X } from "lucide-react"
import type { PoliticalParty } from '@/types/election';
import { useEffect, useState } from 'react';
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
  // Search for the party by candidate ID
  const party = mockParties.find(p => Number(p.candidate.id) === candidateId);
  if (!party) return [];
  // Select proposals based on the current language
  return party.candidate.proposals.map(p => p[language === 'en' ? 'en' : 'es']);
}

export function CandidateModal({ candidate, isOpen, onClose }: CandidateModalProps) {
  const proposals = useMockCandidateProposals(Number(candidate.candidate.id));
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  console.log('[CandidateModal] Render', { candidate, proposals });

  // Get translated experience and education
  const experience = candidate.candidate.experience[language === 'en' ? 'en' : 'es'];
  const education = candidate.candidate.education[language === 'en' ? 'en' : 'es'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop con glassmorphism */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300 animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-sm transform transition-all duration-500 animate-slideUp">
        {/* Modal Principal */}
        <div 
          className="relative overflow-hidden rounded-xl border border-slate-600/30 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Efectos decorativos */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/80 via-indigo-500/80 to-purple-500/80" />
          
          {/* Botón de cierre */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-slate-800/50 border border-slate-600/30 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm cursor-pointer"
          >
            <X size={16} />
          </button>

          {/* Contenido del Modal */}
          <div className="relative z-10 p-4 pt-8">
            {/* Foto del candidato */}
            <div className="flex justify-center mb-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-lg transform group-hover:scale-110 transition-transform duration-300" />
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-slate-600/50 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={candidate.candidate.photo}
                    alt={candidate.candidate.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Información del candidato */}
            <div className="text-center mb-4">
              {/* Título del candidato */}
              <div className="mb-2">
                <span className="text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Candidato Presidencial
                </span>
              </div>
              
              {/* Nombre del candidato - más prominente */}
              <h2 className="text-xl font-bold text-white mb-2 tracking-wide">
                {candidate.candidate.name}
              </h2>
              
              {/* Información del partido */}
              <div className="inline-flex flex-col items-center px-4 py-3 rounded-xl border border-slate-500/30 backdrop-blur-sm mb-3">
                <div className="flex items-center mb-1">
                  <div 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: candidate.color }}
                  />
                  <span className="text-sm font-semibold text-white tracking-wide">
                    {candidate.name} ({candidate.abbreviation})
                  </span>
                </div>
                <span className="text-xs font-medium text-blue-200 tracking-wide">
                  {candidate.candidate.name}
                </span>
              </div>
              
              {/* Información personal */}
              <p className="text-sm text-blue-100 mb-1 font-medium">
                {candidate.candidate.age} {t('candidate.age')}
              </p>
              <p className="text-slate-300 mb-2 text-xs leading-relaxed">
                {education}
              </p>
            </div>

            {/* Experiencia */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-1 h-4 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {t('candidate.experience')}
                </h3>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-2 border border-slate-700/50 backdrop-blur-sm">
                <p className="text-slate-200 text-xs leading-relaxed">
                  {experience}
                </p>
              </div>
            </div>

            {/* Propuestas */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {t('candidate.main_proposals')}
                </h3>
              </div>
              <div className="space-y-1.5">
                {proposals.length === 0 ? (
                  <div className="bg-slate-800/40 rounded-lg p-2 border border-slate-700/50 backdrop-blur-sm">
                    <p className="text-slate-400 italic text-xs text-center">
                      {t('candidate.no_proposals')}
                    </p>
                  </div>
                ) : (
                  proposals.map((proposal, index) => (
                    <div 
                      key={index}
                      className="group flex items-start gap-1.5 p-2 rounded-md bg-slate-800/30 border border-slate-700/30 hover:bg-slate-700/30 transition-all duration-300 hover:border-slate-600/50 backdrop-blur-sm"
                      style={{
                        animation: `slideIn 0.4s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <div 
                        className="w-1 h-1 rounded-full mt-1 flex-shrink-0 shadow-lg"
                        style={{
                          backgroundColor: candidate.color,
                          boxShadow: `0 0 6px ${candidate.color}40`
                        }}
                      />
                      <span className="text-slate-200 text-xs leading-relaxed group-hover:text-white transition-colors duration-300">
                        {proposal}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Redes Sociales */}
            {candidate.candidate.socials && (
              <div className="border-t border-slate-700/50 pt-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Redes Sociales
                  </h3>
                </div>
                <div className="flex justify-center gap-2">
                  {candidate.candidate.socials.threads && (
                    <a 
                      href={candidate.candidate.socials.threads} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group p-2 rounded-full bg-slate-800/50 border border-slate-600/30 hover:bg-black/50 hover:border-slate-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white group-hover:text-slate-200 transition-colors">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18.5A8.5 8.5 0 1 1 20.5 12 8.51 8.51 0 0 1 12 20.5zm.01-13.25c-2.07 0-3.76 1.69-3.76 3.76 0 2.07 1.69 3.76 3.76 3.76 1.13 0 2.13-.47 2.83-1.22v.7c0 1.13-.92 2.05-2.05 2.05-.7 0-1.27-.57-1.27-1.27h-1.5c0 1.53 1.24 2.77 2.77 2.77 1.53 0 2.77-1.24 2.77-2.77v-4.1c0-.41-.34-.75-.75-.75s-.75.34-.75.75v.18c-.7-.75-1.7-1.22-2.83-1.22zm0 1.5c1.24 0 2.26 1.01 2.26 2.26s-1.02 2.26-2.26 2.26-2.26-1.01-2.26-2.26 1.02-2.26 2.26-2.26z" fill="currentColor"/>
                      </svg>
                    </a>
                  )}
                  {candidate.candidate.socials.facebook && (
                    <a 
                      href={candidate.candidate.socials.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group p-2 rounded-full bg-slate-800/50 border border-slate-600/30 hover:bg-blue-600/20 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-blue-400 group-hover:text-blue-300 transition-colors">
                        <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.92.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" fill="currentColor"/>
                      </svg>
                    </a>
                  )}
                  {candidate.candidate.socials.instagram && (
                    <a 
                      href={candidate.candidate.socials.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group p-2 rounded-full bg-slate-800/50 border border-slate-600/30 hover:bg-pink-600/20 hover:border-pink-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-pink-400 group-hover:text-pink-300 transition-colors">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.771.13 4.672.388 3.678 1.382c-.994.994-1.252 2.093-1.31 3.374C2.014 8.332 2 8.741 2 12c0 3.259.014 3.668.072 4.948.058 1.281.316 2.38 1.31 3.374.994.994 2.093 1.252 3.374 1.31C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.281-.058 2.38-.316 3.374-1.31.994-.994 1.252-2.093 1.31-3.374.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.058-1.281-.316-2.38-1.31-3.374-.994-.994-2.093-1.252-3.374-1.31C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm7.2-10.406a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" fill="currentColor"/>
                      </svg>
                    </a>
                  )}
                  {candidate.candidate.socials.web && (
                    <a 
                      href={candidate.candidate.socials.web} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group p-2 rounded-full bg-slate-800/50 border border-slate-600/30 hover:bg-emerald-600/20 hover:border-emerald-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-400 group-hover:text-emerald-300 transition-colors">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8 4.418 0 8 3.582 8 8 0 4.418-3.582 8-8 8zm0-14a6 6 0 1 0 0 12A6 6 0 0 0 12 6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="currentColor"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estilos CSS personalizados */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

