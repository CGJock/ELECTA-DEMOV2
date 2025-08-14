"use client"

import { X, Calendar, GraduationCap, Briefcase, Target, Globe, MessageCircle, Camera } from "lucide-react"
import type { PoliticalParty } from '@/types/election';
import { useEffect, useState } from 'react';
import { mockParties } from '@data/mockData';
import { useTranslation } from 'react-i18next';

interface CandidateModalProps {
  candidate: PoliticalParty
  isOpen: boolean
  onClose: () => void
}

function useMockCandidateProposals(candidateId?: string) {
  const { i18n } = useTranslation();
  const language = i18n.language;

  if (!candidateId) return [];

  const party = mockParties.find(p => p.candidate?.id === candidateId);
  if (!party?.candidate?.proposals) return [];

  return party.candidate.proposals.map(p => p[language === "en" ? "en" : "es"]);
}

export function CandidateModal({ candidate, isOpen, onClose }: CandidateModalProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const [activeTab, setActiveTab] = useState("overview");
  const [imageLoaded, setImageLoaded] = useState(false);

  const candidateId = candidate.candidate?.id;
  const proposals = useMockCandidateProposals(candidateId);

  const experience = candidate.candidate?.experience?.[language === "en" ? "en" : "es"] || "";
  const education = candidate.candidate?.education?.[language === "en" ? "en" : "es"] || "";
  const photo = candidate.candidate?.photo || "";
  const name = candidate.candidate?.name || "Desconocido";
  const socials = candidate.candidate?.socials;

  const socialIcons: Record<string, any> = {
    web: Globe,
    facebook: MessageCircle,
    instagram: Camera,
    threads: MessageCircle
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-2xl"
        onClick={onClose}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-300/20 to-slate-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-sm transform transition-all duration-700 hover:scale-105">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90 backdrop-blur-3xl border border-slate-600/30 shadow-2xl">
          {/* Animated border */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/15 via-slate-500/20 to-cyan-400/15 rounded-2xl blur-xl animate-pulse" />
          <div className="absolute inset-[1px] bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 rounded-2xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-slate-700/50 backdrop-blur-md border border-slate-600/30 text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all duration-300 group"
          >
            <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Content */}
          <div className="relative z-10 p-6">
            {/* Hero Section */}
            <div className="text-center mb-6">
              {/* Profile Image */}
              <div className="relative mx-auto mb-4 group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-slate-500 to-cyan-400 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse" />
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                  <img
                    src={photo}
                    alt={name}
                    className={`w-full h-full object-cover rounded-full border-3 border-slate-500/50 shadow-xl transition-all duration-700 ${imageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-slate-900/10" />
                </div>
              </div>

              {/* Name & Title */}
              <div className="space-y-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent leading-tight">
                  {name}
                </h1>
                <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-slate-500/30 bg-slate-700/50 backdrop-blur-md">
                  <div
                    className="w-2 h-2 rounded-full mr-2 shadow-lg"
                    style={{
                      backgroundColor: candidate.color || "#00ffff",
                      boxShadow: `0 0 10px ${candidate.color || "#00ffff"}60`
                    }}
                  />
                  <span className="text-slate-200 font-medium text-xs">
                    {candidate.abbreviation} • Candidato Presidencial
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex mb-4 p-1 bg-slate-700/30 rounded-xl border border-slate-600/30">
              {[
                { id: "overview", label: "Perfil", icon: Briefcase },
                { id: "proposals", label: "Propuestas", icon: Target }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-cyan-400/15 text-cyan-200 shadow-lg border border-cyan-400/25"
                        : "text-slate-300 hover:text-white hover:bg-slate-600/30"
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === "overview" && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Basic Info */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
                    <Calendar className="text-cyan-300" size={16} />
                    <span className="text-slate-200 text-sm">{candidate.candidate?.age || "N/A"} años</span>
                  </div>

                  {/* Education */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="text-cyan-300" size={16} />
                      <h3 className="text-white font-semibold text-sm">Educación</h3>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-700/30 to-slate-600/20 border border-slate-600/30">
                      <p className="text-slate-200 text-xs leading-relaxed">{education}</p>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="text-cyan-300" size={16} />
                      <h3 className="text-white font-semibold text-sm">Experiencia</h3>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-700/30 to-slate-600/20 border border-slate-600/30">
                      <p className="text-slate-200 text-xs leading-relaxed">{experience}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "proposals" && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="text-cyan-300" size={16} />
                    <h3 className="text-white font-semibold text-sm">Propuestas Principales</h3>
                  </div>

                  {proposals.length === 0 ? (
                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-700/30 to-slate-600/20 border border-slate-600/30">
                      <p className="text-slate-400 italic text-xs text-center">{t("candidate.no_proposals")}</p>
                    </div>
                  ) : (
                    proposals.map((proposal, index) => (
                      <div
                        key={index}
                        className="group p-3 rounded-xl bg-gradient-to-br from-slate-700/30 to-slate-600/20 border border-slate-600/30 hover:border-cyan-400/25 transition-all duration-300 hover:bg-slate-600/30"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 shadow-lg"
                            style={{
                              backgroundColor: candidate.color || "#00ffff",
                              boxShadow: `0 0 8px ${candidate.color || "#00ffff"}60`
                            }}
                          />
                          <p className="text-slate-200 text-xs leading-relaxed group-hover:text-white transition-colors duration-300">
                            {proposal}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Socials */}
            {socials && (
              <div className="mt-6 pt-4 border-t border-slate-600/30">
                <div className="flex justify-center gap-3">
                  {Object.entries(socials).map(([platform, url]) => {
                    if (!url) return null;
                    const Icon = socialIcons[platform] || Globe;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-2 rounded-xl bg-slate-700/30 border border-slate-600/30 hover:bg-slate-600/30 hover:border-cyan-400/25 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                      >
                        <Icon size={16} className="text-slate-300 group-hover:text-cyan-200 transition-colors duration-300" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
