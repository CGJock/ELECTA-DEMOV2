"use client";
import React from 'react';
import { useSocketData } from '@contexts/context';
import { useTranslation } from 'react-i18next';

const VoteBreakdownComponent: React.FC = () => {
  const { breakdownData,timestamp } = useSocketData();
  const { t } = useTranslation();

  

  if (!breakdownData) return <div>{t('counter.loading')}</div>;
  const green = '#22c55e';

  // Solo mostrar el hint si existe traducción válida
  const totalVotesHint = t('counter.total_votes_hint');
  const showHint = totalVotesHint && totalVotesHint !== 'counter.total_votes_hint';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.2rem 1rem 1.2rem 1rem',
      marginTop: '2rem',
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      borderRadius: '18px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      border: '1.5px solid #334155',
      color: '#FFFFFF',
      maxWidth: '420px',
      width: '100%'
    }}>
      {/* Total Votes Highlighted */}
      <div style={{
        width: '100%',
        background: 'rgba(255,255,255,0.07)',
        borderRadius: '12px',
        padding: '0.7rem 0.5rem 0.5rem 0.5rem',
        marginBottom: '1.2rem',
        borderBottom: '2px solid #64748b',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
      }}>
        <div style={{ fontSize: '2.1rem', fontWeight: 700, letterSpacing: '-1px', color: green }}>
          {breakdownData.totalVotes.toLocaleString('es-US')}
        </div>
        <div style={{ fontSize: '1rem', color: '#e5e7eb', marginTop: '0.2rem', fontWeight: 500 }}>
          {t('counter.total_votes')}
        </div>
        {showHint && (
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.1rem' }}>
            {totalVotesHint}
          </div>
        )}
      </div>

      {/* Vote Breakdown Cards */}
      <div style={{
        display: 'flex',
        gap: '1.2rem',
        width: '100%',
        justifyContent: 'center',
        marginBottom: '0.2rem',
      }}>
        {/* Null Votes Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '10px',
          padding: '0.5rem 1.1rem', // menos alto
          minWidth: '120px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          // border: '1px solid #475569', // quitar borde
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f87171' }}>{breakdownData.nullVotes.toLocaleString('es-US')}</div>
          <div style={{ fontSize: '0.95rem', color: '#e5e7eb', fontWeight: 500 }}>{t('counter.null_votes')}</div>
          <div style={{ fontSize: '0.85rem', color: '#fca5a5', marginTop: '0.1rem' }}>{breakdownData.nullPercent}%</div>
        </div>
        {/* Blank Votes Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '10px',
          padding: '0.5rem 1.1rem', // menos alto
          minWidth: '120px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          // border: '1px solid #475569', // quitar borde
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#38bdf8' }}>{breakdownData.blankVotes.toLocaleString('es-ES')}</div>
          <div style={{ fontSize: '0.95rem', color: '#e5e7eb', fontWeight: 500 }}>{t('counter.blank_votes')}</div>
          <div style={{ fontSize: '0.85rem', color: '#7dd3fc', marginTop: '0.1rem' }}>{breakdownData.blankPercent}%</div>
        </div>
      </div>
    </div>
  );
};

export default VoteBreakdownComponent;
