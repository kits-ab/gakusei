import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    se: {
      translations: {
        'Bli student och lär dig japanska!': 'Bli student och lär dig japanska!',
        'Läs mer': 'Läs mer',
        'Gakusei erbjuder många funktioner som underlättar ditt lärande':
          'Gakusei erbjuder många funktioner som underlättar ditt lärande',
        'Testa redan nu!': 'Testa redan nu!',
        'Registrera dig snabbt och enkelt här': 'Registrera dig snabbt och enkelt här',
        'Gissa ordet': 'Gissa ordet',
        'Om Gakusei': 'Om Gakusei',
        Språk: 'Språk',
        'Logga in / Registrera': 'Logga in / Registrera'
      }
    },
    jp: {
      translations: {
        'Bli student och lär dig japanska!': 'スウェーデン語を学ぶ学生になる!',
        'Läs mer': 'もっと読む',
        'Gakusei erbjuder många funktioner som underlättar ditt lärande':
          'Gakuseiはあなたの学習を促進する多くの機能を提供しています',
        'Testa redan nu!': '今すぐ試してみてください！',
        'Registrera dig snabbt och enkelt här': 'ここにすばやく簡単に登録する',
        'Gissa ordet': '単語を推測する',
        'Om Gakusei': 'Gakuseiについて',
        Språk: '言語',
        'Logga in / Registrera': 'ログイン/登録'
      }
    }
  },
  fallbackLng: 'se',
  debug: true,

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ','
  },

  react: {
    wait: true
  }
});

export default i18n;
