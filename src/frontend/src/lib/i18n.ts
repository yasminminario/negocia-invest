import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import pt from '@/locales/pt/common.json';
import en from '@/locales/en/common.json';
import es from '@/locales/es/common.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            pt: { translation: pt },
            en: { translation: en },
            es: { translation: es },
        },
        fallbackLng: 'pt',
        supportedLngs: ['pt', 'en', 'es'],
        load: 'languageOnly',
        cleanCode: true,
        lowerCaseLng: true,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'querystring', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
        },
        defaultNS: 'translation',
        react: {
            useSuspense: false,
        },
    });

export default i18n;
