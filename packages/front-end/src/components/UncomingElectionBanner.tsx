"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNextElectionBanner } from '@/hooks/useNextElectionBanner';

export default function UncomingElectionBanner() {
  const { t } = useTranslation();
  const nextElection = useNextElectionBanner();

  if (!nextElection) {
    return null;
  }
  

  return (
    <div className="w-full bg-gradient-to-r from-slate-800/40 via-slate-700/30 to-slate-800/40 border-y border-slate-700/50 mb-4">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="text-center">
          <h2 className="text-base md:text-lg font-medium text-slate-200 mb-1">
            {nextElection.isElectionDay 
              ? t('upcomingElections.election_day_title')
              : t('upcomingElections.banner_subtitle')
            }
          </h2>
          {!nextElection.isElectionDay && (
            <p className="text-slate-400 text-sm">
              <span className="text-emerald-400 font-medium">
                {t(`upcomingElections.${nextElection.countryKey}`)} - {nextElection.date}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
