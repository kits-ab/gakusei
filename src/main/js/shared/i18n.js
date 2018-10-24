import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    se: {
      translations: {
        //AboutScreen
        'aboutScreen.aboutGakusei.h2': 'Om Gakusei',
        'aboutScreen.aboutGakusei.p':
          'Gakusei är en webbapplikation där du kan öva dig på japanska. Applikationen har följande fyra spellägen:',
        'aboutScreen.aboutGakusei.li1':
          '"Gissa ordet" som kan hittas under fliken "Glosor". Här ska man välja rätt översättning på ett ord bland fyra alternativ.',
        'aboutScreen.aboutGakusei.li2':
          '"Bildkort" som även det kan hittas under fliken "Glosor". Här gäller det att gissa rätt på ett ord. Gissade du rätt?',
        'aboutScreen.aboutGakusei.li3': '"Quiz" och här kan du spela frågesporter kopplade till Japan.',
        'aboutScreen.aboutGakusei.li4': '"Kanji" och här kan du testa dina kunskaper i kanji.',

        //AboutScreen - rättigheter
        'aboutScreen.rights.h4': 'Rättigheter',
        'aboutScreen.rights.p': 'Utvecklad i samarbete med ',
        'aboutScreen.rights.p2':
          ' Alla rättigheter till programkoden ägs av Kokitotsos AB. Denna sajt opereras av Daigaku Sverige som licensierar Gakusei av Kokitotsos AB:s genom en öppen källkodslicens. Utbildningsmaterial har sammanställts av Pierre Sandboge, och inkluderar eget material och annat material som framgår på annan plats på den här sidan. ',
        'aboutScreen.rights.p3':
          'drivs utan anställda, med donerade medel, och ingen garanti om tillgänglighet kan ges. Tillhandahållandet av tjänsten kan upphöra när som helst utan förvarning.',

        'Läs mer': 'Läs mer',
        'Gakusei erbjuder många funktioner som underlättar ditt lärande':
          'Gakusei erbjuder många funktioner som underlättar ditt lärande',
        'Testa redan nu!': 'Testa redan nu!',
        'Registrera dig snabbt och enkelt här': 'Registrera dig snabbt och enkelt här',
        'Gissa ordet': 'Gissa ordet',
        'Om Gakusei': 'Om Gakusei',
        Språk: 'Språk',
        'Logga in / Registrera': 'Logga in / Registrera',
        'Logga in eller registrera dig': 'Logga in eller registrera dig',
        Användarnamn: 'Användarnamn',
        Lösenord: 'Lösenord',
        'Logga in': 'Logga in',
        Registrera: 'Registrera',
        'Håll mig inloggad': 'Håll mig inloggad'
      }
    },
    jp: {
      translations: {
        'aboutScreen.aboutGakusei.h2': 'Gakuseiについて',
        'Läs mer': 'もっと読む',
        'Gakusei erbjuder många funktioner som underlättar ditt lärande':
          'Gakuseiはあなたの学習を促進する多くの機能を提供しています',
        'Testa redan nu!': '今すぐ試してみてください！',
        'Registrera dig snabbt och enkelt här': 'ここにすばやく簡単に登録する',
        'Gissa ordet': '単語を推測する',
        'Om Gakusei': 'Gakuseiについて',
        Språk: '言語',
        'Logga in / Registrera': 'ログイン/登録',
        'Logga in eller registrera dig': 'ログインまたは登録',
        Användarnamn: 'ユーザー名',
        Lösenord: 'パスワード',
        'Logga in': 'ログイン',
        Registrera: 'サインアップ',
        'Håll mig inloggad': '私をログインさせておく'
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
