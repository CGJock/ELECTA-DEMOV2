import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../data/translate/enTranslation.json';
import esTranslation from '../data/translate/esTranslation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
    },
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
    debug: true,
    react: { useSuspense: true },
  });

export default i18n;