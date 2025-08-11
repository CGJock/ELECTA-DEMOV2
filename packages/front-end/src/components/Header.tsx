"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    setDateStr(formatted);
  }, []);

  return (
    <>
      <header style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderBottom: '2px solid #374151',
        position: 'relative',
        paddingBottom: '1rem',
      }}>
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          zIndex: 20
        }}>
          <LanguageSwitcher small />
        </div>

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0',
          position: 'relative',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.7rem 2rem',
            minHeight: '60px',
            width: '100%',
            position: 'relative',
          }}>
            {/* Logo totalmente a la izquierda */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '130px',
              height: '130px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              zIndex: 10
            }}>
              <Image
                src="/img/Logo-trans.png"
                alt="Electa Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            {/* Título perfectamente centrado */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5
            }}>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#FFFFFF',
                margin: 0
              }}>
                <span style={{ color: '#10B981' }}>{t('header.title')}</span>
              </h1>
              <p style={{
                fontSize: '1rem',
                color: '#94A3B8',
                fontWeight: '500',
                margin: '0.5rem 0 0 0'
              }}>
                {t('header.subtitle')}
              </p>
            </div>
          </div>
        </div>
        {dateStr && (
          <div style={{
            position: 'absolute',
            right: '1.5rem',
            bottom: '0.2rem',
            fontSize: '0.92rem',
            color: '#94A3B8',
            zIndex: 30
          }}>
            {dateStr}
          </div>
        )}
      </header>

      <nav style={{
        background: 'rgba(15, 23, 42, 0.95)',
        borderBottom: '1px solid #374151',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0.1rem 0',
            gap: '3rem'
          }}>
            {['home', 'elections', 'about', 'contact'].map((key) => (
              <a
                key={key}
                href="#"
                style={{
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#10B981';
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {t(`nav.${key}`)}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
