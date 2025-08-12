"use client";
import React from 'react';
import { useSocketData } from '@contexts/context';
import { useTranslation } from 'react-i18next';

const radius = 85;
const circumference = 2 * Math.PI * radius;

const ProgressCircle = ({
  percent,
  color,
  label,
  count,
  labelColor,
}: {
  percent: number;
  color: string;
  label: string;
  count: number;
  labelColor: string;
}) => {
  const strokeDashoffset = circumference * (1 - percent / 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
      <svg width={190} height={190} style={{ transform: 'rotate(-135deg)' }}>
        <circle
          cx={95}
          cy={95}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={16}
          fill="none"
        />
        <circle
          cx={95}
          cy={95}
          r={radius}
          stroke={color}
          strokeWidth={16}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: 'calc(50% - 10px)',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontWeight: 700,
        fontSize: '2rem',
        color,
        textAlign: 'center',
        zIndex: 10,
        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}>
        {count.toLocaleString('es-ES')}
      </div>
      <span style={{ color: labelColor, fontWeight: 600, fontSize: '1.2rem', marginTop: '0.5rem' }}>{label}</span>
    </div>
  );
};

const VoteBreakdownComponent: React.FC = () => {
  const { breakdownData, globalSummary, isConnected } = useSocketData();
  const { t } = useTranslation();

  // Debug: mostrar qué datos estamos recibiendo
  console.log('GlobalCounter - breakdownData:', breakdownData);
  console.log('GlobalCounter - globalSummary:', globalSummary);
  console.log('GlobalCounter - isConnected:', isConnected);

  if (!isConnected) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        color: '#fff',
        fontSize: '1.2rem'
      }}>
        <div style={{ color: '#ef4444', marginBottom: '1rem' }}>
          ⚠️ Not Connected
        </div>
        <div style={{ marginTop: '1rem', fontSize: '1rem', color: '#94a3b8' }}>
          Waiting for connection to server...
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          Make sure the backend is running on port 4000
        </div>
      </div>
    );
  }

  if (!breakdownData) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        color: '#fff',
        fontSize: '1.2rem'
      }}>
        <div style={{ color: '#22c55e', marginBottom: '1rem' }}>
          ✅ Connected
        </div>
        {t('counter.loading') || 'Loading Vote Summary...'}
        <div style={{ marginTop: '1rem', fontSize: '1rem', color: '#94a3b8' }}>
          Waiting for vote data from server...
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          Requesting data...
        </div>
      </div>
    );
  }

  const green = '#22c55e';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'transparent',
      padding: '2.5rem',
      margin: '0 auto',
      maxWidth: '1300px',
      color: '#fff'
    }}>
      {/* Left curved progress - Null votes */}
      <div style={{ flex: '0 0 auto', marginRight: '3rem' }}>
        <ProgressCircle
          percent={breakdownData.nullPercent}
          color="#f87171"
          label={t('counter.null_votes')}
          count={breakdownData.nullVotes}
          labelColor="#fca5a5"
        />
      </div>

      {/* Center box - total votes */}
      <div style={{
        textAlign: 'center',
        padding: '2.5rem 4rem',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        border: '1.5px solid #334155',
        minWidth: '240px',
        fontWeight: '700',
        fontSize: '2.6rem',
        color: green,
        userSelect: 'none',
        flex: '0 0 auto'
      }}>
        {breakdownData.totalVotes.toLocaleString('es-US')}
        <div style={{
          fontSize: '1.1rem',
          color: '#e5e7eb',
          marginTop: '0.5rem',
          fontWeight: 500
        }}>
          {t('counter.total_votes')}
        </div>
      </div>

      {/* Right curved progress - Blank votes */}
      <div style={{ flex: '0 0 auto', marginLeft: '3rem' }}>
        <ProgressCircle
          percent={breakdownData.blankPercent}
          color="#38bdf8"
          label={t('counter.blank_votes')}
          count={breakdownData.blankVotes}
          labelColor="#7dd3fc"
        />
      </div>
    </div>
  );
};

export default VoteBreakdownComponent;
