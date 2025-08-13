'use client';
import React, { useEffect, useState } from 'react';
import '../lib/i18n';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, initializeLanguage } from '../lib/i18n';

interface LanguageSwitcherProps {
  small?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ small }) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<string | null>(null);

  useEffect(() => {
    // Inicializar idioma desde localStorage
    initializeLanguage();
    setCurrentLang(getCurrentLanguage());
  }, []);

  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = (lng: 'en' | 'es'): void => {
    changeLanguage(lng);
    setCurrentLang(lng);
  };

  const getButtonStyle = (lng: string): React.CSSProperties => ({
    padding: small ? '0.18rem 0.5rem' : '0.5rem 1rem',
    borderRadius: '5px',
    fontSize: small ? '0.85rem' : '1rem',
    border: '1px solid #ccc',
    backgroundColor: currentLang === lng ? '#f3f4f6' : '#1f2937',
    color: currentLang === lng ? '#111827' : '#ffffff',
    cursor: 'pointer',
    fontWeight: currentLang === lng ? 'bold' : 'normal',
    transition: 'all 0.2s ease-in-out',
    minWidth: small ? '36px' : '48px',
    minHeight: small ? '28px' : '36px',
  });

  // ⚠️ Espera a que se monte el componente y se determine el idioma
  if (!currentLang) return null;

  return (
    <div style={{
      display: 'flex',
      gap: small ? '0.2rem' : '0.5rem',
      justifyContent: 'flex-end',
      padding: small ? '0.1rem' : '1rem',
      background: 'none',
      boxShadow: 'none',
    }}>
      <button style={getButtonStyle('es')} onClick={() => handleLanguageChange('es')}>
        ESP
      </button>
      <button style={getButtonStyle('en')} onClick={() => handleLanguageChange('en')}>
        ENG
      </button>
    </div>
  );
};

export default LanguageSwitcher;
