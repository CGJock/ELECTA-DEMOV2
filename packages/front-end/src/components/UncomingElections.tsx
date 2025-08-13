"use client";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mockParties } from '@data/mockData';

const elections = [
  {
    flag: '🇨🇷',
    countryKey: 'costaRica',
    date: '1 febrero 2026',
    whatKey: 'costaRica_what',
    systemKey: 'costaRica_system',
    parties: [
      { nameKey: 'costaRica_pln', candidateKey: 'costaRica_pln_candidate' },
      { nameKey: 'costaRica_pusc', candidateKey: 'costaRica_pusc_candidate' },
      { nameKey: 'costaRica_psd', candidateKey: 'costaRica_psd_candidate' },
    ],
    summaryKey: 'costaRica_summary',
    dateKey: 'costaRica_date',
  },
  {
    flag: '🇪🇨',
    countryKey: 'ecuador',
    date: '9 febrero y 13 abril 2025',
    whatKey: 'ecuador_what',
    systemKey: 'ecuador_system',
    parties: [
      { nameKey: 'ecuador_noboa', candidateKey: 'ecuador_noboa_candidate' },
      { nameKey: 'ecuador_gonzalez', candidateKey: 'ecuador_gonzalez_candidate' },
    ],
    summaryKey: 'ecuador_summary',
    dateKey: 'ecuador_date',
  },
  {
    flag: '🇰🇷',
    countryKey: 'southKorea',
    date: '3 junio 2025 (elección anticipada)',
    whatKey: 'southKorea_what',
    systemKey: 'southKorea_system',
    parties: [
      { nameKey: 'southKorea_dp', candidateKey: 'southKorea_dp_candidate' },
      { nameKey: 'southKorea_ppp', candidateKey: 'southKorea_ppp_candidate' },
      { nameKey: 'southKorea_rp', candidateKey: 'southKorea_rp_candidate' },
    ],
    summaryKey: 'southKorea_summary',
    dateKey: 'southKorea_date',
  },
  {
    flag: '🇲🇼',
    countryKey: 'malawi',
    date: '16 septiembre 2025',
    whatKey: 'malawi_what',
    systemKey: 'malawi_system',
    parties: [
      { nameKey: 'malawi_mcp', candidateKey: 'malawi_mcp_candidate' },
      { nameKey: 'malawi_dpp', candidateKey: 'malawi_dpp_candidate' },
      { nameKey: 'malawi_pp', candidateKey: 'malawi_pp_candidate' },
    ],
    summaryKey: 'malawi_summary',
    dateKey: 'malawi_date',
  },
  {
    flag: '🇹🇿',
    countryKey: 'tanzania',
    date: '28 octubre 2025',
    whatKey: 'tanzania_what',
    systemKey: 'tanzania_system',
    parties: [
      { nameKey: 'tanzania_ccm', candidateKey: 'tanzania_ccm_candidate' },
      { nameKey: 'tanzania_chadema', candidateKey: 'tanzania_chadema_candidate' },
    ],
    summaryKey: 'tanzania_summary',
    dateKey: 'tanzania_date',
  },
  {
    flag: '🇨🇱',
    countryKey: 'chile',
    date: '16 noviembre 2025',
    whatKey: 'chile_what',
    systemKey: 'chile_system',
    parties: [
      { nameKey: 'chile_right', candidateKey: 'chile_right_candidate' },
      { nameKey: 'chile_left', candidateKey: 'chile_left_candidate' },
    ],
    summaryKey: 'chile_summary',
    dateKey: 'chile_date',
  },
  {
    flag: '🇬🇼',
    countryKey: 'guineaBissau',
    date: '23 noviembre 2025',
    whatKey: 'guineaBissau_what',
    systemKey: 'guineaBissau_system',
    parties: [
      { nameKey: 'guineaBissau_paigc', candidateKey: 'guineaBissau_paigc_candidate' },
      { nameKey: 'guineaBissau_madem', candidateKey: 'guineaBissau_madem_candidate' },
      { nameKey: 'guineaBissau_prs', candidateKey: 'guineaBissau_prs_candidate' },
    ],
    summaryKey: 'guineaBissau_summary',
    dateKey: 'guineaBissau_date',
  },
];

export default function UpcomingElections() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header con gradiente sutil */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-blue-900/20 to-emerald-900/20 opacity-50"></div>
        <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-24">
          <h1 className="text-4xl md:text-6xl font-light text-center mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              {t('upcomingElections.title')}
            </span>
          </h1>
          <p className="text-center text-slate-400 text-base md:text-xl font-light max-w-2xl mx-auto">
            {t('upcomingElections.subtitle')}
          </p>
        </div>
      </header>

      {/* Grid de elecciones */}
      <div className="max-w-6xl mx-auto px-2 pb-10">
        <div className="grid gap-3 md:gap-6 grid-cols-1">
          {elections.map((election, idx) => (
            <article 
              key={election.countryKey}
              className="group relative overflow-hidden rounded-xl border border-slate-800/50 bg-slate-900/60 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-emerald-500/10 hover:border-emerald-500/30"
            >
              {/* Gradiente decorativo */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 opacity-60"></div>
              
              <div className="p-3 md:p-5">
                {/* Header de la elección */}
                <header className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-xl md:text-3xl group-hover:scale-110 transition-transform duration-300">
                      {election.flag}
                    </div>
                    <div>
                      <h2 className="text-base md:text-xl font-light text-slate-100 mb-0.5">
                        {t(`upcomingElections.${election.countryKey}`)}
                      </h2>
                      <time className="text-emerald-400 font-medium text-xs md:text-sm tracking-wide">
                        {t(`upcomingElections.${election.dateKey}`, { defaultValue: election.date })}
                      </time>
                    </div>
                  </div>
                </header>

                {/* Contenido principal */}
                <div className="space-y-3">
                  {/* Qué se elige */}
                  <div className="bg-slate-800/30 rounded-lg p-2 md:p-3 border border-slate-700/50">
                    <h3 className="text-blue-300 font-medium mb-1 text-xs uppercase tracking-wider">
                      {t('upcomingElections.what')}
                    </h3>
                    <p className="text-slate-200 leading-snug text-xs md:text-sm">
                      {t(`upcomingElections.${election.whatKey}`)}
                    </p>
                  </div>

                  {/* Sistema electoral */}
                  <div className="bg-slate-800/30 rounded-lg p-2 md:p-3 border border-slate-700/50">
                    <h3 className="text-blue-300 font-medium mb-1 text-xs uppercase tracking-wider">
                      {t('upcomingElections.system')}
                    </h3>
                    <p className="text-slate-200 leading-snug text-xs md:text-sm">
                      {t(`upcomingElections.${election.systemKey}`)}
                    </p>
                  </div>

                  {/* Principales partidos */}
                  <div className="bg-slate-800/30 rounded-lg p-2 md:p-3 border border-slate-700/50">
                    <h3 className="text-emerald-300 font-medium mb-2 text-xs uppercase tracking-wider">
                      {t('upcomingElections.main_parties')}
                    </h3>
                    <div className="space-y-1.5">
                      {election.parties.map((party, i) => (
                        <div key={i} className="flex items-start gap-2 group/party">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 flex-shrink-0 group-hover/party:bg-blue-400 transition-colors"></div>
                          <div>
                            <span className="font-medium text-slate-100 block text-xs md:text-sm">
                              {t(`upcomingElections.${party.nameKey}`)}
                            </span>
                            {party.candidateKey && (
                              <span className="text-slate-400 text-xs">
                                {t(`upcomingElections.${party.candidateKey}`)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resumen */}
                  <div className="bg-gradient-to-r from-slate-800/40 to-slate-800/20 rounded-lg p-2 md:p-3 border border-slate-700/50">
                    <h3 className="text-slate-300 font-medium mb-1 text-xs uppercase tracking-wider">
                      {t('upcomingElections.context')}
                    </h3>
                    <p className="text-slate-300 leading-snug text-xs">
                      {t(`upcomingElections.${election.summaryKey}`)}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-8 text-center">
          <p className="text-slate-400 text-xs md:text-sm">
            {t('upcomingElections.footer')}
          </p>
        </div>
      </footer>
    </main>
  );
}