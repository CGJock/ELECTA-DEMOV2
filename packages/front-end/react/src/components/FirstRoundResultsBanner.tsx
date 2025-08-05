'use client'
import React from 'react';
import { ChevronDown, BarChart3 } from 'lucide-react';

interface FirstRoundResultsBannerProps {
  isVisible: boolean;
}

const FirstRoundResultsBanner: React.FC<FirstRoundResultsBannerProps> = ({ isVisible }) => {
  const scrollToSecondRoundBanner = () => {
    // Buscar el elemento SecondRoundBanner y hacer scroll hacia él
    const secondRoundBanner = document.querySelector('[data-second-round-banner]');
    if (secondRoundBanner) {
      secondRoundBanner.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      // Si no hay banner de segunda ronda (porque hay ganador), hacer scroll al mapa
      const mapSection = document.querySelector('[data-map-section]') || 
                        document.querySelector('.map-container') ||
                        document.querySelector('#map');
      if (mapSection) {
        mapSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      margin: '1rem auto',
      padding: '0 1rem',
    }}>
      <button
        onClick={scrollToSecondRoundBanner}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          border: '1.5px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '12px 20px',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.95rem',
          fontWeight: 600,
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #334155 0%, #475569 100%)';
          e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #1E293B 0%, #334155 100%)';
          e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.1)';
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <BarChart3 size={18} style={{ color: '#10B981' }} />
          <span>📊 Resultados de la Primera Vuelta</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          opacity: 0.8,
        }}>
          <span>Ver detalles</span>
          <ChevronDown size={16} style={{ color: '#10B981' }} />
        </div>
      </button>
    </div>
  );
};

export default FirstRoundResultsBanner; 