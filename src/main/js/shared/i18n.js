import i18n from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';

i18n.use(languageDetector).init({
  lngs: ['se', 'jp', 'en'],
  fallbackLng: 'se',
  debug: true,

  // we init with resources
  resources: {
    se: {
      translations: {
        gakuseiNav: '',
        'gakuseiNav.guessPlay': 'Gissa ordet',
        'gakuseiNav.flashcardPlay': 'Bildkort',
        'gakuseiNav.kanjiPlay': 'Kanji',
        'gakuseiNav.quizPlay': 'Quiz',
        'gakuseiNav.vocablePlay': 'Glosor',
        'gakuseiNav.about': 'Om Gakusei',
        'gakuseiNav.lang': 'Språk',
        'gakuseiNav.loggedIn': 'Inloggad som:',
        'gakuseiNav.logout': 'Logga ut',
        'gakuseiNav.signIn': 'Logga in / Registrera',
        'gakuseiNav.settings': 'Inställningar',
        'gakuseiNav.swe': 'Svenska',
        'gakuseiNav.jp': 'Japanska',
        test: 'Användarnamnet måste vara mellan 2 och 32 tecken långt.',

        gakuseiSettings: '',
        'gakuseiSettings.settings': 'Inställningar',
        'gakuseiSettings.languageOption': 'Språkalternativ',
        'gakuseiSettings.defaultLanguage': 'Standardspråk ',

        aboutGakusei: '',
        'aboutGakusei.aboutGakusei.h2': 'Om Gakusei',
        'aboutGakusei.aboutGakusei.p':
          ' Gakusei är en webbapplikation där du kan öva dig på japanska. Applikationen har följande fyra spellägen:',
        'aboutGakusei.aboutGakusei.li1':
          '"Gissa ordet"; som kan hittas under fliken Glosor. Här ska man välja rätt översättning på ett ord bland fyra alternativ.',
        'aboutGakusei.aboutGakusei.li2':
          '"Bildkort"; som även det kan hittas under fliken Glosor. Här gäller det att gissa rätt på ett ord. Gissade du rätt?',
        'aboutGakusei.aboutGakusei.li3': 'Quiz och här kan du spela frågesporter kopplade till Japan.',
        'aboutGakusei.aboutGakusei.li4': 'Kanji och här kan du testa dina kunskaper i kanji.',
        'aboutgakusei.rights': '',
        'aboutGakusei.rights.h4': 'Rättigheter',
        'aboutGakusei.rights.p': 'Utvecklad i samarbete med ',
        'aboutGakusei.rights.link': 'KITS AB',
        'aboutGakusei.rights.p2':
          'Alla rättigheter till programkoden ägs av Kokitotsos AB. Denna sajt opereras av Daigaku Sverige som licensierar Gakusei av Kokitotsos AB:s genom en öppen källkodslicens. Utbildningsmaterial har sammanställts av Pierre Sandboge, och inkluderar eget material och annat material som framgår på annan plats på den här sidan. ',
        'aboutGakusei.rights.link2': 'Daigaku.se',
        'aboutGakusei.rights.p3':
          'drivs utan anställda, med donerade medel, och ingen garanti om tillgänglighet kan ges. Tillhandahållandet av tjänsten kan upphöra när som helst utan förvarning.',
        'aboutGakusei.licenses': '',
        'aboutGakusei.licenses.licens': 'Licenser',
        'aboutGakusei.licenses.modul': 'Modul',
        'aboutGakusei.licenses.version': 'Version:',
        'aboutGakusei.licenses.repo': 'Repository',
        'aboutGakusei.licenses.licenses': 'Licens(er)',
        'aboutGakusei.licenses.p': 'Webbappen Gakusei går under licensen',
        'aboutGakusei.licenses.link': 'MIT',
        'aboutGakusei.licenses.p2': 'Nedan följer en lista på licenser för de moduler som projektet använder sig av.',
        'aboutGakusei.licenses.panelToggle': 'Klicka för fler Licenser',
        'aboutGakusei.infoBanner': '',
        'aboutGakusei.infoBanner.contributors': '',
        'aboutGakusei.infoBanner.contributors.contributors': 'Medverkande',
        'aboutGakusei.infoBanner.contributors.p3': 'Se vilka som bidragit till projektet',
        'aboutGakusei.infoBanner.contributors.link2': 'här',
        'aboutGakusei.infoBanner.github': '',
        'aboutGakusei.infoBanner.github.github': 'github',
        'aboutGakusei.infoBanner.github.p': 'Besök gärna open-source projektets',
        'aboutGakusei.infoBanner.github.link': 'Githubsida',
        'aboutGakusei.infoBanner.owner': '',
        'aboutGakusei.infoBanner.owner.owner': 'Ägande',
        'aboutGakusei.infoBanner.owner.p': 'Alla rättigheter till programkoden ägs av Kokitotsos AB.',
        'aboutGakusei.finishScreen': '',
        'aboutGakusei.finishScreen.correct': '% rätt!',
        'aboutGakusei.finishScreen.rightAnswer': ' Du svarade rätt på ',
        'aboutGakusei.finishScreen.witch': 'av ',
        'aboutGakusei.finishScreen.sumQuestion': ' möjliga frågor',
        'aboutGakusei.finishScreen.tryAgain': 'Försök igen',
        'aboutGakusei.finishScreen.button': 'Välj nya frågor',
        'aboutGakusei.finishScreen.question': 'Fråga',
        'aboutGakusei.finishScreen.dontknow': 'Vet ej',
        'aboutGakusei.finishScreen.Right': 'Rätt',
        'aboutGakusei.finishScreen.answer': 'Svar: ',
        'aboutGakusei.finishScreen.youAnswered': 'Du svarade: ',

        cards: '',
        'cards.flashcard.turnCard': 'Vänd på kortet',
        'cards.flashcard.couldYouAnswer': 'Kunde du svaret?',
        'cards.writecard.writeCorrectly': 'Ritade du rätt?',
        'cards.yes': 'Ja',
        'cards.no': 'Nej',

        grammarScreen: '',
        homeScreen: '',
        'homeScreen.rightAnswer': 'Andel rätt svar!',
        'homeScreen.wrongAnswer': 'Andel fel svar',
        'homeScreen.favLesson': 'Dina favoritlektioner',
        'homeScreen.progressbar': '% avklarat',
        'homeScreen.quiestionLeft': 'Du har klarat ',
        'homeScreen.of': ' av ',
        'homeScreen.words': ' ord ',
        'homeScreen.gameNav': 'Navigera till speltyperna i menyn för att lägga till lektioner här.',
        'homeScreen.welcomeUser': 'Välkommen, ',
        'homeScreen.userStatics': 'Din svarsstatistik:',
        'homeScreen.loading': 'Loading...',
        loginScreen: '',
        'loginScreen.registerTitel': 'Registrera dig snabbt och enkelt här',
        'loginScreen.p1':
          ' Vi sparar inga personuppgifter så var noga med att komma ihåg ditt lösenord då vi inte kan återställa det åt dig.',
        'loginScreen.p2':
          'Materialet är anpassat efter det svenska språket och du kan lära dig från svenska till japanska och japanska till svenska',
        'loginScreen.signUp': 'Logga in eller registrera dig',
        'loginScreen.Form': '',
        'loginScreen.Form.placeholderName': 'Användarnamn',
        'loginScreen.Form.placehoolderPassword': 'Lösenord',
        'loginScreen.login': '',
        'loginScreen.login.login': 'Logga in',
        'loginScreen.login.register': 'Registrera',
        'loginScreen.login.rememberMe': 'Håll mig inloggad',
        'loginScreen.login.forward': 'Inloggad, tar dig vidare..',
        'loginScreen.login.wrongTasks': 'Felaktiga uppgifter, vänligen kontrollera formuläret.',
        logoutScreen: '',
        playScreen: '',
        selectScreen: '',
        'selectScreen.pageHeader': '',
        'selectScreen.pageHeader.quiz': 'Quiz',
        'selectScreen.pageHeader.guess': 'Gissa ordet',
        'selectScreen.pageHeader.translate': 'Översätt ordet',
        'selectScreen.pageHeader.flashcards': 'Bildkort',
        'selectScreen.pageHeader.kanji': 'Skriv Kanji',
        'selectScreen.pageHeader.grammar': 'Böj verb',
        'selectScreen.pageHeader.error': 'No play type specified',
        'selectScreen.pageDescription': '',
        'selectScreen.pageDescription.quiz':
          'Sätt dina kunskaper om Japan på prov genom att välja en av 4 svarsalternativ',
        'selectScreen.pageDescription.guess': 'Välj mellan 4 svarsalternativ för den korrekta översättningen.',
        'selectScreen.pageDescription.translate': 'Översätt det visade ordet i fritext.',
        'selectScreen.pageDescription.flashcards':
          'Träna dig själv genom att använda kort, med frågan på ena sidan och rätta svaret på den andra.',
        'selectScreen.pageDescription.kanji': 'Försök rita kanji-tecken med korrekta drag och i rätt ordning.',
        'selectScreen.pageDescription.grammar': 'Böj det visade ordet i fritext på angiven verbform.',
        'selectScreen.pageDescription.error': 'No play type specified',
        'selectScreen.getLessons': '',
        'selectScreen.getLessons.lessons': 'Lektioner',
        'selectScreen.getLessons.tooltopRed': 'Besvarade frågor som behöver repeteras',
        'selectScreen.getLessons.tooltipBlue': 'Obesvarade frågor',
        'selectScreen.getLessons.toolTipIncor': 'Antal felbesvarade frågor',
        'selectScreen.getLessons.smartLearaning': 'Smart inlärningsläge',
        'selectScreen.getLessons.on': 'På',
        'selectScreen.getLessons.of': 'Av',
        'selectScreen.getLessons.drawEasy': 'Enkelt - Följ en bana',
        'selectScreen.getLessons.drawMeduim': 'Medium - Rita med hjälp',
        'selectScreen.getLessons.drawHard': 'Svårt - Rita på frihand',
        'selectScreen.getLessons.panel': '',
        'selectScreen.getLessons.panel.mixedQuestion': 'Blandade frågor ',
        'selectScreen.getLessons.panel.mixedFavLession': 'Blandade frågor från alla dina favoritmarkerade lektioner.',
        'selectScreen.getLessons.panel.rongQuestion': 'Felbesvarade frågor ',
        'selectScreen.getLessons.panel.failedQuestions': 'Här hamnar alla frågor som du har svarat fel på.',
        'selectScreen.displayLessions': '',
        'selectScreen.displayLessions.lessonFav': 'Pågående lektioner',
        'selectScreen.displayLessions.lessonFavDone': 'Färdiga lektioner',
        'selectScreen.displayLessions.otherLesson': 'Övriga lektioner',
        startScreen: '',
        'startScreen.navigation': '',
        'startScreen.header': '',
        'startScreen.header.introductionTitle': 'Bli student och lär dig japanska!',
        'startScreen.jumbotronBanner': '',
        'startScreen.jumbotronBanner.colOne': '',
        'startScreen.jumbotronBanner.colOne.h2': 'Gakusei erbjuder många funktioner som underlättar ditt lärande',
        'startScreen.aboutFeatureImage': '',
        'startScreen.aboutFeatureImage.colTwo': '',
        'startScreen.aboutFeatureImage.colTwo.h3': 'Ett bra komplement till undervisning',
        'startScreen.aboutFeatureImage.colTwo.p':
          'Olika sorters övningar, anpassade efter japanska undervisning på högskolenivå.',
        'startScreen.aboutFeatureImage.colThree': '',
        'startScreen.aboutFeatureImage.colThree.h3': 'Gakusei överallt',
        'startScreen.aboutFeatureImage.colThree.p':
          'Öva med Gakusei på mobilen! Fungerar lika på mobila enheter som på laptops',
        'startScreen.aboutFeatureImage.colFour': '',
        'startScreen.aboutFeatureImage.colFour.h3': 'Anonymitet',
        'startScreen.aboutFeatureImage.colFour.p':
          'Gakusei lagrar ingen personlig data om sina användare, det enda som behövs är ett användarnamn.',
        'startScreen.aboutFeatureImage.colFive': '',
        'startScreen.aboutFeatureImage.colFive.h3': 'quizar',
        'startScreen.aboutFeatureImage.colFive.p': 'Prova våra quizar och se vad du kan om Japan.',
        'startScreen.aboutFeatureImage.colSix': '',
        'startScreen.aboutFeatureImage.colSix.h3': 'Smart inlärningsteknologi',
        'startScreen.aboutFeatureImage.colSix.p':
          'Vårt system kommer ihåg hur du har svarat på frågor, på så sätt kan vi anpassa inlärningsmaterialet efter dig.',
        'startScreen.jumbotronBannerDaigaku': '',
        'startScreen.jumbotronBannerDaigaku.h2': 'Daigaku Sverige utvecklar Gakusei',
        'startScreen.jumbotronBannerDaigaku.p':
          'Daigaku Sverige har som mål att främja undervisning i, och forskning om japanska. Idag måste man i stor utsträckning lära sig japanska via engelska. Vi tror att det skulle vara en fördel om åtminstone en del inlärning kan ske direkt från svenska till japanska. Därför har vi skapat Gakusei, den första webbapplikationen som lär dig japanska via svenska!',
        'startScreen.jumbotronRegister': '',
        'startScreen.jumbotronRegister.h2': 'Utöka din kunskap med Gakusei!',
        'appScreen:': '',
        'appScreen.copyrightText': '© Gakusei 2018 - Alla rättigheter reserverade.',
        'appScreen.aboutUsLink': 'Om oss',
        'numbers:': '',
        zero: '0',
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9',
        button: '',
        readMore: 'Läs mer',
        tryNow: 'Testa redan nu!',
        register: 'Registrera dig nu!'
      }
    },
    en: {
      translations: {
        gakuseiNav: '',
        'gakuseiNav.guessPlay': 'Guess the word',
        'gakuseiNav.flashcardPlay': 'Flashcards',
        'gakuseiNav.kanjiPlay': 'Kanji',
        'gakuseiNav.quizPlay': 'Quiz',
        'gakuseiNav.vocablePlay': 'Vocabulary',
        'gakuseiNav.about': 'About Gakusei',
        'gakuseiNav.lang': 'Language',
        'gakuseiNav.loggedIn': 'Signed in as:',
        'gakuseiNav.logout': 'Sign out',
        'gakuseiNav.signIn': 'Sign in / Register',
        'gakuseiNav.settings': 'Settings',
        'gakuseiNav.swe': 'Swedish',
        'gakuseiNav.jp': 'Japanese',

        gakuseiSettings: '',
        'gakuseiSettings.settings': 'Settings',
        'gakuseiSettings.languageOption': 'Language options',
        'gakuseiSettings.defaultLanguage': 'Default language ',

        aboutGakusei: '',
        'aboutGakusei.aboutGakusei.h2': 'About Gakusei',
        'aboutGakusei.aboutGakusei.p':
          ' Gakusei is a web application where you can practice Japanese. The application has four game modes:',
        'aboutGakusei.aboutGakusei.li1':
          '"Guess" the word that can be found under "words". Here you should choose the correct translation of one word among four options.',
        'aboutGakusei.aboutGakusei.li2':
          '"Flashcard" can be found under the "words" tab. Here\'s the question of guessing one word. Did you guess right?',
        'aboutGakusei.aboutGakusei.li3':
          '"Quiz" Here you can play questions related to JapanHere you can play questions related to Japan.',
        'aboutGakusei.aboutGakusei.li4': '"Kanji" Here you can test your skills in Kanji.',
        'aboutgakusei.rights': '',
        'aboutGakusei.rights.h4': 'Rights',
        'aboutGakusei.rights.p': 'Developed in cooperation with ',
        'aboutGakusei.rights.link': 'KITS AB',
        'aboutGakusei.rights.p2':
          'All rights to the program code are owned by Kokitotsos AB. This site is operated by Daigaku Sweden and licensed Gakusei by Kokitotsos AB through an open source license. Educational materials have been compiled by Pierre Sandboge, and include own material and other material shown elsewhere on this page. ',
        'aboutGakusei.rights.link2': 'Daigaku.se',
        'aboutGakusei.rights.p3':
          'operated without employees, with donated funds, and no guarantee of availability can be given. The provision of the service may terminate at any time without notice.',
        'aboutGakusei.licenses': '',
        'aboutGakusei.licenses.licens': 'Licensing',
        'aboutGakusei.licenses.modul': 'Module',
        'aboutGakusei.licenses.version': 'Version:',
        'aboutGakusei.licenses.repo': 'Repository:',
        'aboutGakusei.licenses.licenses': 'Licenses',
        'aboutGakusei.licenses.p': 'The Gakusei web site is under license',
        'aboutGakusei.licenses.link': 'MIT',
        'aboutGakusei.licenses.p2': 'Below is a list of licenses for the modules that the project uses.',
        'aboutGakusei.licenses.panelToggle': 'Click for more Licenses',
        'aboutGakusei.infoBanner': '',
        'aboutGakusei.infoBanner.contributors': '',
        'aboutGakusei.infoBanner.contributors.contributors': 'Contributors',
        'aboutGakusei.infoBanner.contributors.p3': 'See who contributed to the project',
        'aboutGakusei.infoBanner.contributors.link2': 'here',
        'aboutGakusei.infoBanner.github': '',
        'aboutGakusei.infoBanner.github.github': 'github',
        'aboutGakusei.infoBanner.github.p': 'Please visit the open-source project',
        'aboutGakusei.infoBanner.github.link': 'Githubpage',
        'aboutGakusei.infoBanner.owner': '',
        'aboutGakusei.infoBanner.owner.owner': 'Ownership',
        'aboutGakusei.infoBanner.owner.p': 'All rights to the program code are owned by Kokitotsos AB.',
        'aboutGakusei.finishScreen': '',
        'aboutGakusei.finishScreen.correct': '% correct!',
        'aboutGakusei.finishScreen.rightAnswer': ' You answered correctly on ',
        'aboutGakusei.finishScreen.witch': 'of ',
        'aboutGakusei.finishScreen.sumQuestion': ' possible questions',
        'aboutGakusei.finishScreen.tryAgain': 'Try again',
        'aboutGakusei.finishScreen.button': 'Select new questions',
        'aboutGakusei.finishScreen.question': 'Question',
        'aboutGakusei.finishScreen.dontknow': "Don't know",
        'aboutGakusei.finishScreen.Right': 'Right',
        'aboutGakusei.finishScreen.answer': 'Answer: ',
        'aboutGakusei.finishScreen.youAnswered': 'You answered: ',

        cards: '',
        'cards.flashcard.turnCard': 'Turn the card',
        'cards.flashcard.couldYouAnswer': 'Could you answer?',
        'cards.writecard.writeCorrectly': 'Did you write correctly?',
        'cards.yes': 'Yes',
        'cards.no': 'No',

        grammarScreen: '',
        homeScreen: '',
        'homeScreen.rightAnswer': 'Answered correctly!',
        'homeScreen.wrongAnswer': 'Answered incorrectly',
        'homeScreen.favLesson': 'Your favorite lessons',
        'homeScreen.progressbar': '% done',
        'homeScreen.quiestionLeft': 'You have answered correctly to ',
        'homeScreen.of': ' of ',
        'homeScreen.words': ' words ',
        'homeScreen.gameNav': 'Navigate to game types in the menu to add lessons.',
        'homeScreen.welcomeUser': 'Welcome, ',
        'homeScreen.userStatics': 'Your statistics:',
        'homeScreen.loading': 'Loading...',
        loginScreen: '',
        'loginScreen.registerTitel': 'Register here',
        'loginScreen.p1':
          ' We do not save any personal data so be sure to remember your password. We have no way of' +
          'resetting it for you.',
        'loginScreen.p2': '',
        'loginScreen.signUp': 'Log in or register',
        'loginScreen.Form': '',
        'loginScreen.Form.placeholderName': 'Username',
        'loginScreen.Form.placehoolderPassword': 'Password',
        'loginScreen.login': '',
        'loginScreen.login.login': 'Login',
        'loginScreen.login.register': 'Register',
        'loginScreen.login.rememberMe': 'Keep me logged in',
        'loginScreen.login.forward': 'Logging in',
        'loginScreen.login.wrongTasks': 'Felaktiga uppgifter, vänligen kontrollera formuläret.',

        logoutScreen: '',
        playScreen: '',
        selectScreen: '',
        'selectScreen.pageHeader': '',
        'selectScreen.pageHeader.quiz': 'Quiz',
        'selectScreen.pageHeader.guess': 'Guess the word',
        'selectScreen.pageHeader.translate': 'Translate the word',
        'selectScreen.pageHeader.flashcards': 'Picture cards',
        'selectScreen.pageHeader.kanji': 'Write Kanji',
        'selectScreen.pageHeader.grammar': 'Verb tense',
        'selectScreen.pageHeader.error': 'No play type specified',
        'selectScreen.pageDescription': '',
        'selectScreen.pageDescription.quiz':
          'Put your knowledge of Japan to the test by choosing one of four alternatives',
        'selectScreen.pageDescription.guess': 'Choose the correct alternative out of four choices.',
        'selectScreen.pageDescription.translate': 'Write the tranlsation the word.',
        'selectScreen.pageDescription.flashcards':
          'Practice by using cards. The question is on one side and the correct answer on the other.',
        'selectScreen.pageDescription.kanji': 'Practice writing kanji using correct strokes in the right order.',
        'selectScreen.pageDescription.grammar': 'Write the correct tense of the verb.',
        'selectScreen.pageDescription.error': 'No play type specified',
        'selectScreen.getLessons': '',
        'selectScreen.getLessons.lessons': 'Lessons',
        'selectScreen.getLessons.tooltopRed': 'Answered questions that need to be repeated',
        'selectScreen.getLessons.tooltipBlue': 'Unanswered questions',
        'selectScreen.getLessons.toolTipIncor': 'Number of wrong answered questions',
        'selectScreen.getLessons.smartLearaning': 'Smart learning mode',
        'selectScreen.getLessons.on': 'On',
        'selectScreen.getLessons.of': 'Of',
        'selectScreen.getLessons.drawEasy': 'Easy - Follow a path',
        'selectScreen.getLessons.drawMeduim': 'Medium - Draw with help',
        'selectScreen.getLessons.drawHard': 'Hard - Draw on the freehand',
        'selectScreen.getLessons.panel': '',
        'selectScreen.getLessons.panel.mixedQuestion': 'Mixed questions',
        'selectScreen.getLessons.panel.mixedFavLession': 'Mixed questions from all your favorite marked lessons.',
        'selectScreen.getLessons.panel.rongQuestion': 'Wrong Answered Questions',
        'selectScreen.getLessons.panel.failedQuestions': 'Here are all the questions you have answered incorrectly.',
        'selectScreen.displayLessions': '',
        'selectScreen.displayLessions.lessonFav': 'Ongoing lessons',
        'selectScreen.displayLessions.lessonFavDone': 'Completed lessons',
        'selectScreen.displayLessions.otherLesson': 'Other lessons',
        startScreen: '',
        'startScreen.navigation': '',
        'startScreen.header': '',
        'startScreen.header.introductionTitle': 'Become a student and learn Japanese!',
        'startScreen.jumbotronBanner': '',
        'startScreen.jumbotronBanner.colOne': '',
        'startScreen.jumbotronBanner.colOne.h2': 'Gakusei offers many features that facilitate your learning',
        'startScreen.aboutFeatureImage': '',
        'startScreen.aboutFeatureImage.colTwo': '',
        'startScreen.aboutFeatureImage.colTwo.h3': 'A good complement to teaching',
        'startScreen.aboutFeatureImage.colTwo.p':
          'Different types of exercises, adapted to Japanese education at university level.',
        'startScreen.aboutFeatureImage.colThree': '',
        'startScreen.aboutFeatureImage.colThree.p':
          'Practice with Gakusei on your mobile! Works equally on mobile devices like on laptops',
        'startScreen.aboutFeatureImage.colThree.h3': 'Gakusei everywhere',
        'startScreen.aboutFeatureImage.colFour': '',
        'startScreen.aboutFeatureImage.colFour.h3': 'Anonymity',
        'startScreen.aboutFeatureImage.colFour.p':
          'Gakusei stores no personal data about its users, all that is required is a username.',
        'startScreen.aboutFeatureImage.colFive': '',
        'startScreen.aboutFeatureImage.colFive.h3': 'quizzes',
        'startScreen.aboutFeatureImage.colFive.p': 'Try our quizzes and see what you know about Japan.',
        'startScreen.aboutFeatureImage.colSix': '',
        'startScreen.aboutFeatureImage.colSix.h3': 'Smart learning technology',
        'startScreen.aboutFeatureImage.colSix.p':
          'Our system remembers how you answered questions, so we can customize the learning material for you.',
        'startScreen.jumbotronBannerDaigaku': '',
        'startScreen.jumbotronBannerDaigaku.h2': 'Daigaku Sweden develops Gakusei',
        'startScreen.jumbotronBannerDaigaku.p':
          'Daigaku Sweden aims to promote teaching and research in Japanese. Today, to a large extent, Japanese must be learned through English. We think it would be an advantage if at least some learning can be done directly from Swedish to Japanese. Therefore we have created Gakusei, the first web application that teaches Japanese through Swedish!',
        'startScreen.jumbotronRegister': '',
        'startScreen.jumbotronRegister.h2': 'Expand your knowledge with Gakusei!',
        'appScreen:': '',
        'appScreen.copyrightText': '© Gakusei 2018 - All rights reserved.',
        'appScreen.aboutUsLink': 'About us',
        'numbers:': '',

        zero: '0',
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9',
        button: '',
        readMore: 'Read more',
        tryNow: 'Try now!',
        register: 'Register now!',
        swedish: 'Swedish',
        japanese: 'Japanese'
      }
    },
    jp: {
      translations: {
        gakuseiNav: '',
        'gakuseiNav.guessPlay': '単語を推測する',
        'gakuseiNav.flashcardPlay': 'フォトカード',
        'gakuseiNav.kanjiPlay': '漢字',
        'gakuseiNav.quizPlay': 'クイズ',
        'gakuseiNav.vocablePlay': '語彙',
        'gakuseiNav.about': '学生について',
        'gakuseiNav.lang': '言語',
        'gakuseiNav.loggedIn': 'ログインした人：',
        'gakuseiNav.logout': 'ログアウトする',
        'gakuseiNav.signIn': 'ログイン/登録',
        'gakuseiNav.settings': '設定',
        'gakuseiNav.swe': 'スウェーデン語',
        'gakuseiNav.jp': '日本の',

        aboutGakusei: '',
        'aboutGakusei.aboutGakusei.h2': '学生について',
        'aboutGakusei.aboutGakusei.p':
          '学生は、日本語で練習できるWebアプリケーションです。アプリケーションには、次の4つのゲームモードがあります。',
        'aboutGakusei.aboutGakusei.li1':
          'スペルのタブの下にある単語を推測してください。 ここでは、4つのオプションの中から1つの単語の正しい翻訳を選択する必要があります。',
        'aboutGakusei.aboutGakusei.li2':
          'スペルチェックタブの下にある絵カード。 1つの単語を推測するという質問があります。 あなたは正しいと思いましたか？',
        'aboutGakusei.aboutGakusei.li3': 'クイズ、ここで日本に関する質問をすることができます。',
        'aboutGakusei.aboutGakusei.li4': '漢字と漢字であなたのスキルをテストできます。',
        'aboutgakusei.rights': '',
        'aboutGakusei.rights.h4': '権利',
        'aboutGakusei.rights.p': '協力して開発 ',
        'aboutGakusei.rights.link': 'KITS AB',
        'aboutGakusei.rights.p2':
          'プログラムコードのすべての権利は、Kokitotsos ABによって所有されています。 このサイトは、スウェーデン大学図書館が運営しています。スウェーデンは、Kokitotsos ABによる学生のライセンスをオープンソースライセンスで提供しています。 教育資料は、Pierre Sandboge によって編集されており、このページの他の場所に示されている自分自身の資料やその他の資料が含まれています。',
        'aboutGakusei.rights.link2': 'Daigaku.se',
        'aboutGakusei.rights.p3':
          '従業員なしで運営され、寄付された資金で運営され、可用性の保証はありません。 サービスの提供は、通知なしにいつでも終了することができます。',
        'aboutGakusei.licenses': '',
        'aboutGakusei.licenses.licens': 'ライセンス',
        'aboutGakusei.licenses.modul': 'モジュール',
        'aboutGakusei.licenses.version': 'バージョン：',
        'aboutGakusei.licenses.repo': 'リポジトリ：',
        'aboutGakusei.licenses.licenses': 'ライセンス',
        'aboutGakusei.licenses.p': '学生用アプリはライセンス契約に基づいています',
        'aboutGakusei.licenses.link': 'MIT',
        'aboutGakusei.licenses.p2': '以下は、プロジェクトが使用するモジュールのライセンス一覧です。',
        'aboutGakusei.licenses.panelToggle': 'その他のライセンスはここをクリック',
        'aboutGakusei.infoBanner': '',
        'aboutGakusei.infoBanner.contributors': '',
        'aboutGakusei.infoBanner.contributors.contributors': '協力者',
        'aboutGakusei.infoBanner.contributors.p3': '誰がプロジェクトに貢献したかを見る',
        'aboutGakusei.infoBanner.contributors.link2': 'ここに',
        'aboutGakusei.infoBanner.github': '',
        'aboutGakusei.infoBanner.github.github': 'ギブス',
        'aboutGakusei.infoBanner.github.p': 'オープンソースプロジェクトをご覧ください',
        'aboutGakusei.infoBanner.github.link': 'ページ。',
        'aboutGakusei.infoBanner.owner': '',
        'aboutGakusei.infoBanner.owner.owner': '所有権',
        'aboutGakusei.infoBanner.owner.p': 'プログラムコードのすべての権利は、Kokitotsos ABによって所有されています。',
        'aboutGakusei.finishScreen': '',
        'aboutGakusei.finishScreen.correct': '％右！',
        'aboutGakusei.finishScreen.rightAnswer': ' あなたは正しく答えた ',
        'aboutGakusei.finishScreen.witch': 'の ',
        'aboutGakusei.finishScreen.sumQuestion': ' 可能な質問',
        'aboutGakusei.finishScreen.tryAgain': 'もう一度お試しください',
        'aboutGakusei.finishScreen.button': '新しい質問を選択',
        'aboutGakusei.finishScreen.question': '頼みます',
        'aboutGakusei.finishScreen.dontknow': 'わからない',
        'aboutGakusei.finishScreen.Right': '右',
        'aboutGakusei.finishScreen.answer': '返信 :',
        'aboutGakusei.finishScreen.youAnswered': 'あなたは答えました: ',

        gakuseiSettings: '',
        'gakuseiSettings.settings': '設定',
        'gakuseiSettings.languageOption': '言語オプション',
        'gakuseiSettings.defaultLanguage': 'デフォルト言語 ',

        cards: '',
        'cards.flashcard.turnCard': 'カードを回す',
        'cards.flashcard.couldYouAnswer': 'あなたは正しく答えましたか？',
        'cards.writecard.writeCorrectly': 'あなたは右を描いたのですか',
        'cards.yes': 'はい',
        'cards.no': 'いいえ。',

        grammarScreen: '',
        homeScreen: '',
        'homeScreen.rightAnswer': '正しい答えを共有してください！',
        'homeScreen.wrongAnswer': '間違った答えを共有する',
        'homeScreen.favLesson': 'お気に入りのレッスン',
        'homeScreen.progressbar': 'クリアされた％',
        'homeScreen.quiestionLeft': 'あなたはそれをやった ',
        'homeScreen.of': ' の ',
        'homeScreen.words': ' 単語 ',
        'homeScreen.gameNav': 'メニューのゲームタイプに移動してレッスンを追加します。',
        'homeScreen.welcomeUser': 'ようこそ、 ',
        'homeScreen.userStatics': 'あなたの応答の統計：',
        'homeScreen.loading': '充填...',
        loginScreen: '',
        'loginScreen.registerTitel': 'ここにすばやく簡単に登録する',
        'loginScreen.p1': '私たちは個人情報を保存しませんので、パスワードを覚えておいてください。',
        'loginScreen.p2': 'この資料はスウェーデン語に適合しており、スウェーデン語から日本語、スウェーデン語',
        'loginScreen.signUp': 'ログインまたは登録',
        'loginScreen.Form': '',
        'loginScreen.Form.placeholderName': 'ユーザー名',
        'loginScreen.Form.placehoolderPassword': 'パスワード',
        'loginScreen.login': '',
        'loginScreen.login.login': 'ログイン',
        'loginScreen.login.register': 'サインアップ',
        'loginScreen.login.rememberMe': '私をログインさせておく',
        'loginScreen.login.forward': 'ログインして、あなたを連れて行く..',
        'loginScreen.login.wrongTasks': 'Felaktiga uppgifter, vänligen kontrollera formuläret.',

        logoutScreen: '',
        playScreen: '',
        selectScreen: '',
        'selectScreen.pageHeader': '',
        'selectScreen.pageHeader.quiz': '考査',
        'selectScreen.pageHeader.guess': '単語を推測する',
        'selectScreen.pageHeader.translate': '言葉を翻訳する',
        'selectScreen.pageHeader.flashcards': 'フォトカード',
        'selectScreen.pageHeader.kanji': 'タイプ漢字',
        'selectScreen.pageHeader.grammar': '曲げ動詞',
        'selectScreen.pageHeader.error': 'No play type specified',
        'selectScreen.pageDescription': '',
        'selectScreen.pageDescription.quiz': '正しい翻訳のために4つの回答オプションを選択します',
        'selectScreen.pageDescription.guess': '正しい翻訳のために4つの回答オプションを選択します。',
        'selectScreen.pageDescription.translate': '表示された単語をフリーテキストに翻訳します。',
        'selectScreen.pageDescription.flashcards':
          'カードを使って自分の身体を鍛えましょう。片方の質問ともう片方の答えを修正してください。',
        'selectScreen.pageDescription.kanji':
          'カードを使って自分の身体を鍛えましょう。片方の質問ともう片方の答えを修正してください。',
        'selectScreen.pageDescription.grammar': '表示された単語を、指定された動詞形式のフリーテキストに収めます。',
        'selectScreen.pageDescription.error': '再生タイプが指定されていません',
        'selectScreen.getLessons': '',
        'selectScreen.getLessons.lessons': 'レッスン',
        'selectScreen.getLessons.tooltopRed': '反復する必要がある質問',
        'selectScreen.getLessons.tooltipBlue': '未解決の質問',
        'selectScreen.getLessons.toolTipIncor': 'スペルの間違いの数',
        'selectScreen.getLessons.smartLearaning': 'スマート学習モード',
        'selectScreen.getLessons.on': '上の',
        'selectScreen.getLessons.of': 'の',
        'selectScreen.getLessons.drawEasy': 'シンプル - パスに従う',
        'selectScreen.getLessons.drawMeduim': 'ミディアム - ヘルプ付きで描画',
        'selectScreen.getLessons.drawHard': '難しい - フリーハンドで描く',
        'selectScreen.getLessons.panel': '',
        'selectScreen.getLessons.panel.mixedQuestion': '混在した質問',
        'selectScreen.getLessons.panel.mixedFavLession':
          'あなたのお気に入りのレッスンのすべてからの質問を混ぜてください',
        'selectScreen.getLessons.panel.rongQuestion': '間違った答え',
        'selectScreen.getLessons.panel.failedQuestions': 'あなたが間違って答えたすべての質問がここにあります。',
        'selectScreen.displayLessions': '',
        'selectScreen.displayLessions.lessonFav': '進行中のレッスン',
        'selectScreen.displayLessions.lessonFavDone': '完了したレッスン',
        'selectScreen.displayLessions.otherLesson': 'その他のレッスン',
        startScreen: '',
        'startScreen.navigation': '',
        'startScreen.header': '',
        'startScreen.header.introductionTitle': '学生になって日本語を学ぶ！',
        'startScreen.jumbotronBanner': '',
        'startScreen.jumbotronBanner.colOne': '',
        'startScreen.jumbotronBanner.colOne.h2': '学生はあなたの学習を促進する多くの機能を提供しています',
        'startScreen.aboutFeatureImage': '',
        'startScreen.aboutFeatureImage.colTwo': '',
        'startScreen.aboutFeatureImage.colTwo.h3': '教えることの良い補足',
        'startScreen.aboutFeatureImage.colTwo.p': '大学レベルの日本の教育に適応したさまざまなタイプの練習。',
        'startScreen.aboutFeatureImage.colThree': '',
        'startScreen.aboutFeatureImage.colThree.h3': 'どこでもどこでも',
        'startScreen.aboutFeatureImage.colThree.p':
          'モバイルで学生と一緒に練習しましょう！ ラップトップのようなモバイルデバイスでも同等に動作します。',
        'startScreen.aboutFeatureImage.colFour': '',
        'startScreen.aboutFeatureImage.colFour.h3': '匿名',
        'startScreen.aboutFeatureImage.colFour.p':
          '学生はユーザーの個人情報を保管していません。必要なのはユーザー名だけです。',
        'startScreen.aboutFeatureImage.colFive': '',
        'startScreen.aboutFeatureImage.colFive.h3': '除去する',
        'startScreen.aboutFeatureImage.colFive.p': 'クイズをして、日本について何ができるか見てみましょう。',
        'startScreen.aboutFeatureImage.colSix': '',
        'startScreen.aboutFeatureImage.colSix.h3': 'スマートな学習技術',
        'startScreen.aboutFeatureImage.colSix.p':
          '私たちのシステムは質問にどのように答えたかを記憶していますので、学習教材をカスタマイズすることができます。',
        'startScreen.jumbotronBannerDaigaku': '',
        'startScreen.jumbotronBannerDaigaku.h2': '大學スウェーデン、学術振興',
        'startScreen.jumbotronBannerDaigaku.p':
          '大学スウェーデンは、日本語での教授と研究の促進を目指しています。 今日、日本人は英語で学ぶ必要があります。 私たちは、スウェーデン語から日本語に直接いくつかの学習を直接行うことができれば有利だと思います。 そのため、スウェーデン語で日本語を教える最初のWebアプリケーションであるGakuseiを作成しました。',
        'startScreen.jumbotronRegister': '',
        'startScreen.jumbotronRegister.h2': '学生と知識を広げる',
        appScreen: '',
        'appScreen.copyrightText': '©Gakusei 2018  - すべての権利を保有します。',
        'appScreen.aboutUsLink': '私たちについて',
        numbers: '',
        zero: '0',
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9',
        button: '',
        readMore: 'もっと読む',
        tryNow: '今すぐ試してみてください！',
        register: '今すぐサインアップ！',
        swedish: 'スウェーデン語',
        japanese: '日本の'
      }
    }
  },

  keySeparator: false, // we use content as keys

  detectBrowserLanguage: true
});

export default i18n;
