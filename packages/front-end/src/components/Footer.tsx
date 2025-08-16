"use client";

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Incident } from '@/types/election';
import DisclaimerModal from './DisclaimerModal';

interface FooterProps {
  onAddIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
}

const Footer: React.FC<FooterProps> = ({ onAddIncident }) => {
  const { t } = useTranslation();
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  return (
    <>
      <footer style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '1rem 0',
        borderTop: '2px solid #374151',
        marginTop: '1.5rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '1rem'
          }}>
            {/* Company Info */}
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#10B981'
              }}>
                ELECTA
              </h3>
              <p style={{
                color: '#64748B',
                lineHeight: '1.6',
                marginBottom: '1rem'
              }}>
                {t('footer.company_desc')}
              </p>
              <div style={{
                display: 'flex',
                gap: '1rem'
              }}>
                <span style={{
                  color: '#10B981',
                  fontWeight: '600'
                }}>
                  {t('footer.status_live')}
                </span>
                <span style={{
                  color: '#64748B'
                }}>
                  • {t('footer.status_realtime')}
                </span>
              </div>
            </div>

            {/* Quick Links */}
            {/* <div>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#10B981'
              }}>
                {t('footer.quick_links')}
              </h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="/" style={{
                    color: '#64748B',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#10B981'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}>
                    {t('footer.link_home')}
                  </a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="/main/elections" style={{
                    color: '#64748B',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#10B981'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}>
                    {t('footer.link_elections')}
                  </a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="/main/elections" style={{
                    color: '#64748B',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#10B981'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}>
                    {t('footer.link_about')}
                  </a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="/main/faq" style={{
                    color: '#64748B',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#10B981'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}>
                    {t('footer.link_contact')}
                  </a>
                </li>
              </ul>
            </div> */}

            {/* Disclaimer Section
            <div>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#10B981'
              }}>
                {t('footer.legal_notice')}
              </h4>
              <p style={{
                color: '#64748B',
                lineHeight: '1.6',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                {t('disclaimer.paragraph1')}...
              </p>
              <button
                onClick={() => setIsDisclaimerOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                {t('footer.ver_mas')}
              </button>
            </div> */}
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#64748B',
              fontSize: '0.9rem',
              margin: 0
            }}>
              © 2024 ELECTA. {t('footer.rights_reserved')} | 
              <a href="#" style={{
                color: '#10B981',
                textDecoration: 'none',
                marginLeft: '0.5rem'
              }}>
                {t('footer.privacy_policy')}
              </a> | 
              <a href="#" style={{
                color: '#10B981',
                textDecoration: 'none',
                marginLeft: '0.5rem'
              }}>
                {t('footer.terms_of_service')}
              </a>
            </p>
          </div>
        </div>
      </footer>

      <DisclaimerModal 
        open={isDisclaimerOpen} 
        onClose={() => setIsDisclaimerOpen(false)} 
      />
    </>
  );
};

export default Footer; 