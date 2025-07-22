import React, { useState } from 'react';
import SubscribeModal from '@components/SubscribeModal';
import { useTranslation } from 'react-i18next';

interface SubscriptionBannerProps {
  dateStr?: string;
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = () => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  return (
    <div
      role="region"
      aria-label="Suscripción electoral"
      style={{
        width: '100vw',
        left: 0,
        right: 0,
        background: '#1E293B',
        color: '#10B981',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        padding: '0.5rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 20,
        animation: 'fadeInDown 0.7s',
        minHeight: 'unset',
      }}
    >
      <div className="electa-banner-row" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.1rem',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        flex: 1,
        minWidth: 0,
      }}>
        <span style={{ fontWeight: 600, fontSize: '1rem', whiteSpace: 'pre-line', textAlign: 'center', lineHeight: 1.2 }}>
          Subscribe for alerts
        </span>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#10B981',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '6px',
            padding: '0.25rem 0.8rem',
            fontWeight: '500',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            minWidth: 90,
            marginLeft: 10,
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
            e.currentTarget.style.color = '#34D399';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            e.currentTarget.style.color = '#10B981';
          }}
        >
          Subscribe
        </button>
      </div>
      <SubscribeModal open={showModal} onClose={() => setShowModal(false)} />
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 500px) {
          .electa-banner-row {
            flex-direction: column !important;
            gap: 0.6rem !important;
            max-width: 98vw !important;
            padding: 0 0.5rem !important;
          }
          span { font-size: 0.97rem !important; }
        }
      `}</style>
    </div>
  );
};

export default SubscriptionBanner; 