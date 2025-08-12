import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '@translation/enTranslation.json';
import esTranslation from '@translation/esTranslation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
    },
    lng: 'es', // Idioma por defecto (Bolivia)
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
    debug: true, // Mantener debug para desarrollo
    react: { useSuspense: false }, // Deshabilitar Suspense para evitar problemas de hidratación
  });

// Función para cambiar el idioma
export const changeLanguage = (language: 'en' | 'es') => {
  i18n.changeLanguage(language);
  // Guardar en localStorage para persistencia
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', language);
  }
};

// Función para obtener el idioma actual
export const getCurrentLanguage = () => {
  return i18n.language;
};

// Función para inicializar el idioma desde localStorage
export const initializeLanguage = () => {
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('preferred-language') as 'en' | 'es';
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      i18n.changeLanguage(savedLanguage);
    }
  }
};

export default i18n;