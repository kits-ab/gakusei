import i18n from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';
import resources from '../../../../locales';

i18n.use(languageDetector).init({
  lng: i18n.languages,
  fallbackLng: 'se',
  debug: true,

  // we init with resources
  resources: resources,

  keySeparator: true, // we use content as keys

  detectBrowserLanguage: true
});

export default i18n;
