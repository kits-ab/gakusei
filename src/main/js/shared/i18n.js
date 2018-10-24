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
        "aboutGakusei":"",
        "aboutGakusei.aboutGakusei.h2":"学生について",
          "aboutGakusei.aboutGakusei.p":"学生は、日本語で練習できるWebアプリケーションです。アプリケーションには、次の4つのゲームモードがあります。",
          "aboutGakusei.aboutGakusei.li1":"スペルのタブの下にある単語を推測してください。 ここでは、4つのオプションの中から1つの単語の正しい翻訳を選択する必要があります。",
          "aboutGakusei.aboutGakusei.li2":"スペルチェックタブの下にある絵カード。 1つの単語を推測するという質問があります。 あなたは正しいと思いましたか？",
          "aboutGakusei.aboutGakusei.li3":"Quiz och här kan du spela frågesporter kopplade till Japan.",
          "aboutGakusei.aboutGakusei.li4":"&quot;Kanji&quot; och här kan du testa dina kunskaper i kanji.",
          "aboutgakusei.rights":"",
                "aboutGakusei.rights.h4":"権利",
                "aboutGakusei.rights.p":"協力して開発",
                "aboutGakusei.rights.link":"KITS AB",
                "aboutGakusei.rights.p2":". プログラムコードのすべての権利は、Kokitotsos ABによって所有されています。 このサイトは、スウェーデン大学図書館が運営しています。スウェーデンは、Kokitotsos ABによる学生のライセンスをオープンソースライセンスで提供しています。 教育資料は、Pierre Sandbogeによって編集されており、このページの他の場所に示されている自分自身の資料やその他の資料が含まれています。",
                "aboutGakusei.rights.link2":"Daigaku.se",
                "aboutGakusei.rights.p3":"従業員なしで運営され、寄付された資金で運営され、可用性の保証はありません。 サービスの提供は、通知なしにいつでも終了することができます。"
                "aboutGakusei.licenses":"",
                "aboutGakusei.licenses.licens":"ライセンス",
                "aboutGakusei.licenses.modul":"モジュール",
                "aboutGakusei.licenses.version": "バージョン：",
                "aboutGakusei.licenses.repo": "リポジトリ：",
                "aboutGakusei.licenses.licenses":"ライセンス",
                "aboutGakusei.licenses.p":"学生用アプリはライセンス契約に基づいています",
                "aboutGakusei.licenses.link":"MIT",
                "aboutGakusei.licenses.p2":". 以下は、プロジェクトが使用するモジュールのライセンス一覧です。",
                "aboutGakusei.licenses.panelToggle":"その他のライセンスはここをクリック",
          "aboutGakusei.infoBanner":"",
              "aboutGakusei.infoBanner.contributors":"",
                  "aboutGakusei.infoBanner.contributors.contributors":"協力者",
                  "aboutGakusei.infoBanner.contributors.p3":"誰がプロジェクトに貢献したかを見る",
                  "aboutGakusei.infoBanner.contributors.link2":"ここに",
              "aboutGakusei.infoBanner.github":"",
                  "aboutGakusei.infoBanner.github.github":"ギブス",
                  "aboutGakusei.infoBanner.github.p":"オープンソースプロジェクトをご覧ください",
                  "aboutGakusei.infoBanner.github.link":"ページ。",
              "aboutGakusei.infoBanner.owner":"",
                  "aboutGakusei.infoBanner.owner.owner":"所有権",
                  "aboutGakusei.infoBanner.owner.p":"プログラムコードのすべての権利は、Kokitotsos ABによって所有されています。"

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
