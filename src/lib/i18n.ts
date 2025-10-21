import { en, es } from '@/locales';
import { auth } from '@/locales/en';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    auth: en.auth,
  },
  es: {
    auth: es.auth,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    defaultNS: 'resource',
    ns: [
      'auth',
    ],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    keySeparator: '.',
    nsSeparator: false,
  });

export default i18n;
