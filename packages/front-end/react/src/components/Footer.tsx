"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Incident } from '@/types/election';

interface FooterProps {
  onAddIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
}

const Footer: React.FC<FooterProps> = ({ onAddIncident }) => {
  const { t } = useTranslation();
  return (
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
          <div>
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
                <a href="#" style={{
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
                <a href="#" style={{
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
                <a href="#" style={{
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
                <a href="#" style={{
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
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#10B981'
            }}>
              {t('footer.contact')}
            </h4>
            <div style={{
              color: '#64748B',
              lineHeight: '1.6'
            }}>
              <p style={{ marginBottom: '0.5rem' }}>
                {t('footer.email')}: info@electa.bo
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                {t('footer.phone')}: +591 2 123 4567
              </p>
              <p>
                {t('footer.address')}: La Paz, Bolivia
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#10B981'
            }}>
              {t('footer.follow_us')}
            </h4>
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <a href="#" style={{
                color: '#64748B',
                textDecoration: 'none',
                fontSize: '1.25rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#10B981'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}>
                📘
              </a>
              <a href="#" style={{
                color: '#64748B',
                textDecoration: 'none',
                fontSize: '1.25rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#10B981'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}>
                📷
              </a>
              <a href="#" style={{
                color: '#64748B',
                textDecoration: 'none',
                fontSize: '1.25rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#10B981'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}>
                🐦
              </a>
            </div>
          </div>
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
  );
};

export default Footer; 