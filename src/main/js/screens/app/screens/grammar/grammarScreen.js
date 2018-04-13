/* global speechSynthesis */
/* eslint-disable */

import { Grid, Col } from 'react-bootstrap';

import DisplayQuestion from '../../shared/DisplayQuestion';
import Utility from '../../../../shared/util/Utility';
// import * as Lessons from '../../../../shared/reducers/Lessons';
// import * as Security from '../../../../shared/reducers/Security';

export const Reducers = [];

export class grammarScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  say(text) {
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'ja-JP';
    speechSynthesis.speak(msg);
  }

  render() {
    const titleStyle = { paddingTop: '10px' };

    return (
      <Grid>
        <Col>
          <div>
            <h1>Grammatik jp1200, Text 1</h1>
            <h2 id="gcon_15" style={titleStyle}>
              ~られる、~える - Potentiella verb <a href="#gcon_15">#</a>
            </h2>
            <p>
              Verb på potentialform har betydelsen kan, har förmågan, är möjlig. Hur formen bildas varierar: Ru-verb,
              verbstam + られる, u-verb, verb minus u + える. くる blir こられる och する blir できる. På potentialform
              böjs verbet som ett ru-verb. Partiklar bibehålls, men を kan bli antingen を eller が. För できる ersätts
              を oftast med が.
            </p>
            <DisplayQuestion
              primaryText={'助けてあげられなくてごめんね。'}
              secondaryText={"Sorry I couldn't save you."}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <DisplayQuestion
              primaryText={'私は食べられる。'}
              secondaryText={'I can eat.'}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <hr />
            <p>Textbok kap. 13</p>
            <hr />
            <h2 id="gcon_16" style={titleStyle}>
              ~し - Förklaringar <a href="#gcon_16">#</a>
            </h2>
            <p>
              し fyller samma funktion som から i mönstret anledning から situation, men med mer än en anledning, dvs
              anledning X し、 anledning Y し、 situation Z。. Situationen kan komma först, situation Z。 anledning X
              し、 anledning Y し。. Anledningarna är på kortform. Om bara ett し används så implicerar det fler,
              outtalade, anledningar.
            </p>
            <DisplayQuestion
              primaryText={'今度は確認し、再確認し、さらにもう一度確認します。'}
              secondaryText={"This time, I'll check, double-check and check again."}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <hr />
            <p>Textbok kap. 13</p>
            <hr />
            <h2 id="gcon_17" style={titleStyle}>
              ~そうです - Det ser ut som att... <a href="#gcon_17">#</a>
            </h2>
            <p>
              Adjektiv på basform + そうです talar om att det verkar som att det är så, en gissning baserad på egna
              intryck. Basform bildas genom att ta bort avslutande い respektive な. Ett undantag är いい som blir よさ.
              För negativa adjektiv gör man om ない till なさ. Man kan istället göra om そうです till そうじゃないです.
            </p>
            <p>Textbok kap. 13</p>
            <hr />
            <h2 id="gcon_18" style={titleStyle}>
              そうな~ - Som verkar vara <a href="#gcon_18">#</a>
            </h2>
            <p>
              För att ge ett substantiv en egenskap som verkar vara så, använder man adjektiv + そうな + substantiv.
              Adjektiv + そう bildar ett な-adjektiv, därav そうな.
            </p>
            <DisplayQuestion
              primaryText={'その料理はおいしそうなにおいがする。'}
              secondaryText={'The dish smells good.'}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <hr />
            <p>Textbok kap. 13</p>
            <hr />
            <h2 id="gcon_19" style={titleStyle}>
              ~てみる - Försöka eller prova <a href="#gcon_19">#</a>
            </h2>
            <p>
              Verb på て-form + みる indikerar att man ska försöka eller titta på att göra verbhandlingen. "Jag ska se
              om det går att laga cykeln." Observera att hjälpverbet みる alltid skrivs med kana, trots att det
              egentligen är samma som 見る.
            </p>
            <p>Textbok kap. 13</p>
            <hr />
            <h2 id="gcon_20" style={titleStyle}>
              ~なら - Men bara <a href="#gcon_20">#</a>
            </h2>
            <p>
              Substantiv X + なら + uttryck Y. X är en del av, eller alternativ, till en frågeställning Y. "Kan du köra
              motorcykel? Bara bil, inte motorcykel." "Gillade du kinesiska? Japanska, kinesiska har jag aldrig
              studerat."
            </p>
            <p>Textbok kap. 13</p>
            <hr />
            <h2 id="gcon_21" style={titleStyle}>
              ~に~回 - X gånger per Y <a href="#gcon_21">#</a>
            </h2>
            <p>period Y + に + frekvens X + 回 = X gånger per Y. "3 ggr om dagen." "En gång per månad."</p>
            <p>Textbok kap. 13</p>
            <hr />
            <h2 id="gcon_22" style={titleStyle}>
              ほしい - Jag vill ha <a href="#gcon_22">#</a>
            </h2>
            <p>
              ほしい är ett adjektiv som talar om att objektet är åtråvärt för mig, och är det vanliga sättet att tala
              om att man vill ha något. Dvs "Jag vill ha mat" formuleras som "Mat är åtråvärt för mig".
            </p>
            <p>Textbok kap. 14</p>
            <hr />
            <h2 id="gcon_23" style={titleStyle}>
              ~かもしれません - Det är möjligt att... <a href="#gcon_23">#</a>
            </h2>
            <p>
              Godtycklig kortform X + かもしれません betyder jag gissar att X är möjligt. Substantiv och な-adjektiv
              används utan avslutande な.
            </p>
            <p>Textbok kap. 14</p>
            <hr />
            <h2 id="gcon_25" style={titleStyle}>
              ~くれる - Ge (pil in) <a href="#gcon_25">#</a>
            </h2>
            <p>
              Gåvor som gynnar mig direkt eller indirekt (grov generalisering) kräver くれる istället för あげる. Om
              någon ger mig något, så är det jag som gynnas, och då används くれる. Om en främling ger min bror något,
              så används också också くれる, man kan tänka att om min familj blir rikare så smittar det av sig på mig,
              men min ena bror ger något till min andra bror så är det status quo, och då ska inte くれる användas. Det
              är inte släktskap i sig som spelar roll, utan emotionell närhet, mina bästa vänner kan ingå i min inre
              sfär, t ex. En person man pratar med just nu brukar också ingå i en inre sfär. Om man tänker sig gåvans
              väg, så rör den sig in mot mig. Jämför med あげる.
            </p>
            <p>Textbok kap. 14</p>
            <hr />
            <h2 id="gcon_24" style={titleStyle}>
              ~あげる - Ge (pil ut) <a href="#gcon_24">#</a>
            </h2>
            <p>
              En grov tumregel är att om inte jag blir berikad, direkt eller indirekt, så används あげる. Exemple på
              detta är om jag ger något, om en främling ger något till en annan främling, om en familjemdlem ger en
              annan familjemedlem något. Om man tänker sig gåvans väg, så rör den sig ut från mig, eller åtminstone inte
              in mot mig. Jämför med くれる.
            </p>
            <p>Textbok kap. 14</p>
            <hr />
            <h2 id="gcon_26" style={titleStyle}>
              ~もらう - Få <a href="#gcon_26">#</a>
            </h2>
            <p>
              Den här förklaringen är otydlig, läs i textboken tillsvidare. もらう används i betydelsen att få, men får
              bara användas i samma situation som くれる (med motsatt subjekt och objekt, förstås).
            </p>
            <p>Textbok kap. 14</p>
            <hr />
            <h2 id="gcon_34" style={titleStyle}>
              ~てあげる - Ge tjänst (pil ut) <a href="#gcon_34">#</a>
            </h2>
            <p>
              Motsvarigheten till あげる för att göra någon en tjänst är: Verb på て-form + あげる. てあげる ändrar inte
              grundbetydelsen, det talar bara om att handlingen gjordes som en tjänst (på begäran eller eget initiativ).
              Jfr med ~あげる.
            </p>
            <p>Textbok kap. 16</p>
            <hr />
            <h2 id="gcon_35" style={titleStyle}>
              ~てくれる - Ge tjänst (pil in) <a href="#gcon_35">#</a>
            </h2>
            <p>
              Motsvarigheten till くれる för att göra någon en tjänst är: Verb på て-form + くれる. てくれる ändrar inte
              grundbetydelsen, det talar bara om att handlingen gjordes som en tjänst (på begäran eller eget initiativ).
              Jfr med ~くれる.
            </p>
            <p>Textbok kap. 16</p>
            <hr />
            <h2 id="gcon_36" style={titleStyle}>
              ~てもらう - Få tjänst <a href="#gcon_36">#</a>
            </h2>
            <p>
              Motsvarigheten till もらう för att få en tjänst är: Verb på て-form + もらう. てもらう ändrar inte
              grundbetydelsen, det talar bara om att handlingen gjordes som en tjänst (på begäran eller eget initiativ).
              Jfr med ~もらう.
            </p>
            <p>Textbok kap. 16</p>
            <hr />
            <h2 id="gcon_27" style={titleStyle}>
              ~たらどうですか - Min rekommendation <a href="#gcon_27">#</a>
            </h2>
            <p>
              Verb på kortform dåtid + らどうですか, är ett råd eller rekommendation. Det kan uppfattas som uppläxande,
              så använd med viss försiktighet. "Du borde motionera lite oftare." Observera att man inte kan använda
              uttrycket för att bjuda hem någon.
            </p>
            <p>Textbok kap. 14</p>
            <hr />
            <h2 id="gcon_28" style={titleStyle}>
              ~をX台も - Så många som... <a href="#gcon_28">#</a>
            </h2>
            <p>
              Man lägger på も efter räknaren för att tala om att talet är ett stort antal i sammanhanget. Dvs
              substantiv + をX台も + uttryck, där X台 är ett tal inklusive räknare. Det kan förstås vara en annan
              räknare än 台.
            </p>
            <p>Textbok kap. 14</p>
            <hr />
            <h2 id="gcon_29" style={titleStyle}>
              ~をX台しか - Inte mer än... <a href="#gcon_29">#</a>
            </h2>
            <p>
              Man lägger på しか efter räknaren för att tala om att talet är ett litet antal i sammanhanget. Dvs
              substantiv + をX台しか + nekande uttryck, där X台 är ett tal inklusive räknare. Det kan förstås vara en
              annan räknare än 台.
            </p>
            <p>Textbok kap. 14</p>
            <hr />
            <h2 id="gcon_30" style={titleStyle}>
              ~おう/~よう - Volitional <a href="#gcon_30">#</a>
            </h2>
            <p>
              Volitional är en verbform som används för att föreslå något, liknande men mindre formellt än ましょう.
              Bildas så här: Ru-verb, ta bort ru och lägg på よう. U-verb, ta bort u och lägg på おう. 来る blir こよう
              och する, しよう. Lägger man på ka, så vill man ha motpartens åsikt.
            </p>
            <p>Textbok kap. 15</p>
            <hr />
            <h2 id="gcon_31" style={titleStyle}>
              ~おうと思っています - Intention <a href="#gcon_31">#</a>
            </h2>
            <p>
              Volitionalformen tillsammans med と思っています indikerar intention. Man har bestämt sig för att göra
              något. Med と思います indikerarat det också intention, men något man bestämt här och nu.
            </p>
            <p>Textbok kap. 15</p>
            <hr />
            <h2 id="gcon_32" style={titleStyle}>
              ~ておく - Förberedande syfte <a href="#gcon_32">#</a>
            </h2>
            <p>
              Verb på te-form + hjälpverbet おく beskriver något som görs i förberedande syfte. I talspråk dras ておく
              ofta ihop till とく.
            </p>
            <p>Textbok kap. 15</p>
            <hr />
            <h2 id="gcon_33" style={titleStyle}>
              - - Att kvalificera substantiv med bisatser <a href="#gcon_33">#</a>
            </h2>
            <p>
              Man kan kvalificera ett substantiv med en bisats, uttryck X + substantiv Y, som motsvarar Y som X.
              "Blommorna som jag fick av henne." Resultatet, bisats + substantiv, används som ett vanligt substantiv.
            </p>
            <p>Textbok kap. 15</p>
            <hr />
            <h2 id="gcon_37" style={titleStyle}>
              ~ていただけませんか - Be om hjälp (artigt) <a href="#gcon_37">#</a>
            </h2>
            <p>
              Verb på て-form + いただけませんか används för en artig förfrågan, vilket vara lämpligt gentemot en
              främling eller överordnad.
            </p>
            <p>Textbok kap. 16</p>
            <hr />
            <h2 id="gcon_38" style={titleStyle}>
              ~てくれませんか - Be om hjälp <a href="#gcon_38">#</a>
            </h2>
            <p>
              Verb på て-form + くれませんか kan användas i normalformella sammanhang för en förfrågan. Ungefär samma
              nivå som ください.
            </p>
            <p>Textbok kap. 16</p>
            <hr />
            <h2 id="gcon_39" style={titleStyle}>
              ~てくれない？ - Be om hjälp (vardagligt) <a href="#gcon_39">#</a>
            </h2>
            <p>
              Verb på て-form + くれない？ används för förfrågningar i vardagliga sammanhang, bland vänner och liknande.
            </p>
            <p>Textbok kap. 16</p>
            <hr />
            <h2 id="gcon_40" style={titleStyle}>
              ~といいですね - Jag hoppas du... <a href="#gcon_40">#</a>
            </h2>
            <p>
              Verb på kortform, icke-dåtid + といいですね uttrycker en positiv önskan för någon annan. "Hoppas du får
              bra väder på din resa". Används inte för mottagarens egna handlingar. Vardaglig form är といいね. Jfr med
              といいんですが.
            </p>
            <p>Textbok kap. 16</p>
            <hr />
            <h2 id="gcon_41" style={titleStyle}>
              ~といいんですが - Jag hoppas själv... <a href="#gcon_41">#</a>
            </h2>
            <p>
              Verb på kortform, icke-dåtid + といいんですが uttrycker en positiv önskan för egen del. "Hoppas jag får
              bra väder på resan". Används inte för egna handlingar, dvs sådan som ligger under min egen kontroll, t ex
              kan man inte använda det till "Jag hoppas kunna resa till Japan snart". Vardaglig form är といいんだけど.
              Jfr med といいですね.
            </p>
            <p>Textbok kap. 16</p>
            <hr />
            <h2 id="gcon_42" style={titleStyle}>
              ~てくれるといいんですが - Jag hoppas du gör X för mig <a href="#gcon_42">#</a>
            </h2>
            <p>
              Verb på て-from + くれるといいんですが är en indirekt förfrågan. "Jag hoppas du kommer imorgon". Jfr med
              といいんですが.
            </p>
            <p>Textbok kap. 16</p>
            <hr />
            <h2 id="gcon_43" style={titleStyle}>
              ~時 - Göra X när Y inträffar <a href="#gcon_43">#</a>
            </h2>
            <p>
              X 時、Y, När X, så Y. Det är tre sidor i textboken, och det är bara "bra nog början". Se textboken för
              förklaring.
            </p>
            <p>Textbok kap. 16</p>
            <hr />
            <h2 id="gcon_44" style={titleStyle}>
              ~てすみませんでした - Jag ber om ursäkt för att... <a href="#gcon_44">#</a>
            </h2>
            <p>
              Använd verb på て-form + すみませんでした för att be om ursäkt. "Förlåt att jag spillde läsk på dina nya
              skor." Jfr med なくてすみませんでした.
            </p>
            <p>Textbok kap. 16</p>
            <hr />
            <h2 id="gcon_46" style={titleStyle}>
              ~なくて - Nekande te-form <a href="#gcon_46">#</a>
            </h2>
            <p>
              Verb på kort-, nekande, te-form bildas genom att utgå från nekande kortformen och ersätta sista い:et med
              くて. ~なくて.
            </p>
            <p>Textbok kap. 16</p>
            <hr />
            <h2 id="gcon_45" style={titleStyle}>
              ~なくてすみませんでした - Jag ber om ursäkt för att jag inte... <a href="#gcon_45">#</a>
            </h2>
            <p>
              Använd verb på kort, negativ,て-form + すみませんでした för att be om ursäkt om något man inte gjort.
              "Förlåt att jag inte kom igår." Jfr med てすみませんでした.
            </p>
            <p>Textbok kap. 16</p>
            <hr />
            <h2 id="gcon_1" style={titleStyle}>
              ~そうです - Jag hörde att... <a href="#gcon_1">#</a>
            </h2>
            <p>
              そうです avslutar en mening på kortform, och markerar hörsägen, "Jag hörde att..." eller "Det lär vara så
              att...". Man vet var informationen kommer ifrån, t ex person, tidning, TV, och vill man ange källan kan
              man inleda meningen med "[källa]によると...そうです", enligt [källa]... Uttrycket böjs normalt sett inte,
              men man kan använda そうだ i informella sammanhang.
            </p>
            <p>Textbok kap. 17</p>
            <hr />
            <h2 id="gcon_2" style={titleStyle}>
              ~って - Jag hörde att... <a href="#gcon_2">#</a>
            </h2>
            <p>って kan användas istället för そうです i informella sammanhang.</p>
            <p>Textbok kap. 17</p>
            <hr />
            <h2 id="gcon_3" style={titleStyle}>
              ~たら - Om och när <a href="#gcon_3">#</a>
            </h2>
            <p>
              Ett たら-uttryck bildas av ett villkor på kortform dåtid + ら, där kortformen är jakande eller nekande,
              och följs av konsekvens. "Om jag hinner, så kommer jag." Sannolikheten för villkoret kan variera, tara kan
              användas för uttryck av typen "när jag kommer hem..." och "om jag var en elefant...".
            </p>
            <DisplayQuestion
              primaryText={'もし何か起こったら、すぐに電話をください。'}
              secondaryText={'If anything happens, call me right away.'}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <DisplayQuestion
              primaryText={'人生からレモンをもらったら、レモネードを作りなさい。'}
              secondaryText={'When life gives you lemons, make lemonade.'}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <DisplayQuestion
              primaryText={'左に曲がったら、白いビルが見えてきます。'}
              secondaryText={"If you turn to the left, you'll see a white building."}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <hr />
            <p>Textbok kap. 17</p>
            <hr />
            <h2 id="gcon_4" style={titleStyle}>
              ~なくてもいいです - Du behöver inte... <a href="#gcon_4">#</a>
            </h2>
            <p>
              なくてもいいです-uttryck bildas av ett utryck på negativ te-form + もいいです. Det betyder "behöver inte",
              som i "Du behöver inte ta av dig skorna" eller "Presenten behöver inte var dyr".
            </p>
            <DisplayQuestion
              primaryText={'そんなに緊張しなくてもいいですよ。'}
              secondaryText={"There's no need to be that tense."}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <DisplayQuestion
              primaryText={'入院しなくてもいいです。'}
              secondaryText={"You don't have to stay in the hospital."}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <DisplayQuestion
              primaryText={'焦らなくてもいいですよ。'}
              secondaryText={"You don't have to hurry."}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <DisplayQuestion
              primaryText={'わざわざ家に来なくてもいいですよ。'}
              secondaryText={'Do not bother to come to my home.'}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <DisplayQuestion
              primaryText={'あなたは昼食代を払わなくてもいいですよ。'}
              secondaryText={"You don't need to pay for your lunch."}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <DisplayQuestion
              primaryText={'資金のことについて心配しなくてもいいですよ。'}
              secondaryText={'There is no need to worry about funds.'}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <DisplayQuestion
              primaryText={'昼ごはんを持ってこなくてもいいです。'}
              secondaryText={'You do not have to bring your lunch.'}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <DisplayQuestion
              primaryText={'トムさんは車を洗わなくてもいいです。メアリーさんはもう洗いましたから。'}
              secondaryText={"Tom doesn't have to wash the car. Mary's already washed it."}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <DisplayQuestion
              primaryText={'明日は来なくてもいいですよ。'}
              secondaryText={"You don't have to come tomorrow."}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <DisplayQuestion
              primaryText={'言い訳しなくてもいいですよ。'}
              secondaryText={"You don't have to make excuses."}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            ><hr />
            <p>Textbok kap. 17</p>
            <hr />
            <h2 id="gcon_5" style={titleStyle}>
              ~みたいです - Liknar... Är som... (substantiv) <a href="#gcon_5">#</a>
            </h2>
            <p>
              みたいです följer ett substantiv, och betyder "liknar", "beter sig som", "är som". Liknelsen avser oftast
              yttre attribut, men måste inte göra det.
            </p>
            <DisplayQuestion
              primaryText={'彼はまるで君の弟みたいだよ。 '}
              secondaryText={'He looks like your brother.'}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <DisplayQuestion
              primaryText={'警官みたいですね。 '}
              secondaryText={'You look like a policeman.'}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <hr />
            <p>Textbok kap. 17</p>
            <hr />
            <h2 id="gcon_6" style={titleStyle}>
              ~みたいです - Verkar... Ser ut som att... (verb) <a href="#gcon_6">#</a>
            </h2>
            <p>
              みたいです följer ett verb på kortform, dåtid eller icke-dåtid, jakande eller nekande, och betyder "verkar
              vara". "Det verkade vara regn på gång", "Kalle verkar törstig"
            </p>
            <DisplayQuestion
              primaryText={'彼女はアメリカ人ではないみたいです。'}
              secondaryText={"She doesn't seem to be an American."}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <DisplayQuestion
              primaryText={'座りなよ。疲れてるみたいだし。 '}
              secondaryText={'Take a seat. You look tired.'}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <hr />
            <p>Textbok kap. 17</p>
            <hr />
            <h2 id="gcon_7" style={titleStyle}>
              ~前に - X efter Y <a href="#gcon_7">#</a>
            </h2>
            <p>
              Kortform (nutid) + 前に betecknar en händelse som sker efter efterföljande huvudsats. "Jag kommer när jag
              köpt mat." Dvs X 前に Y, där X (kortform) är en händelse som sker efter händelse Y.
            </p>
            <DisplayQuestion
              primaryText={'寝る前に、ビールを飲まないでください。 '}
              secondaryText={"Please don't drink beer before going to bed."}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <DisplayQuestion
              primaryText={'旅に行く前に、私は散髪した。'}
              secondaryText={'Before taking a journey, I got a haircut.'}
              japaneseCharacters
              showSpeechButton
              smallerText
            />
            <br />
            <hr />
            <p>Textbok kap. 17</p>
            <hr />
            <h2 id="gcon_8" style={titleStyle}>
              ~てから - X före Y <a href="#gcon_8">#</a>
            </h2>
            <p>
              Te-form + から betecknar en händelse som sker före efterföljande huvudsats. "Jag ska bara släcka innan jag
              går." Dvs X から Y, där X (te-form) är en händelse som sker före händelse Y.
            </p>
            <p>Textbok kap. 17</p>
            <hr />
            <h2 id="gcon_9" style={titleStyle}>
              他動詞 (たどうし) / 自動詞 (じどうし) - Transitiva/intransitiva verb) <a href="#gcon_9">#</a>
            </h2>
            <p>
              Transitiva verb tar objekt (och subjekt), intransitiva verb tar bara subjekt. En del japanska verb bildar
              transitiva par. Tyvärr följer de inget bestämt mönster, även om det finns subgrupper med mönster. Det är
              med andra ord bara att lära sig varje par för sig.
            </p>
            <p>Textbok kap. 18</p>
            <hr />
            <h2 id="gcon_10" style={titleStyle}>
              ~てしまう - Göra klart, fullfölja <a href="#gcon_10">#</a>
            </h2>
            <p>
              Verb på te-form + しまう indikerar att något görs klart, eller fullföljs. "Jag har ätit upp." "Jag har
              läst ut boken." Obs! Se "Oavsiktligt" för alternativ tolkning!
            </p>
            <p>Textbok kap. 18</p>
            <hr />
            <h2 id="gcon_11" style={titleStyle}>
              ~てしまう - Oavsiktligt <a href="#gcon_11">#</a>
            </h2>
            <p>
              Verb på te-form + しまう indikerar en oavsiktlig händelse, ofta kopplad till ånger. "Jag tappade plånboken
              på bussen." "Jag glömde att jag hade ett möte med chefen." Obs! Se "Göra klart, fullfölja" för alternativ
              tolkning!
            </p>
            <p>Textbok kap. 18</p>
            <hr />
            <h2 id="gcon_47" style={titleStyle}>
              ~ちゃう/~じゃう - Göra klart, oavsiktligt (i tal) <a href="#gcon_47">#</a>
            </h2>
            <p>
              I talspråk förkortas ofta てしまう/でしまう till ちゃう/じゃう. I praktiken blir det dåtid och kortform,
              ちゃった/じゃった. Se "Oavsiktligt", "Göra klart, fullfölja".
            </p>
            <p>Textbok kap. 18</p>
            <hr />
            <h2 id="gcon_12" style={titleStyle}>
              ~と - Orsak och verkan <a href="#gcon_12">#</a>
            </h2>
            <p>
              Man kan bilda ett uttryck (X) på kortform, icke-dåtid, + と + uttryck (Y). Y är en följd av X, och X måste
              inträffa före Y. "Jag blir glad när jag hör J-Pop." Konstruktionen kan beskriva orsak och verkan för
              specifika händelser, "När jag körde för fort blev jag stoppad av polisen." När Y innehåller en
              adjektivfras används ofta なる, "楽しくなる", "元気になる".
            </p>
            <p>Textbok kap. 18</p>
            <hr />
            <h2 id="gcon_13" style={titleStyle}>
              ~ながら - Samtidigt utförande <a href="#gcon_13">#</a>
            </h2>
            <p>
              Man kan binda ihop två verb med ながら för att säga att två aktiviteter utförs samtidigt, av samma person
              eller entitet. Verbstam X + ながら + uttryck med verb Y på godtycklig form. Y är huvudhandlingen. "Jag
              sjunger när jag kör bil."
            </p>
            <p>Textbok kap. 18</p>
            <hr />
            <h2 id="gcon_14" style={titleStyle}>
              ~ばよかったです - Jag borde ha... Jag önskar att jag hade... <a href="#gcon_14">#</a>
            </h2>
            <p>
              {' '}
              Verb på kortform, jakande, icke-dåtid, - u + ばよかったです eller Verb på kortform, nekande, icke-dåtid, -
              i + ばよかったです. Det betyder "Jag borde ha...", eller "Jag önskar att jag hade...".
            </p>
            <p>Textbok kap. 18</p>
            <hr />
            <p>
              Exempelmeningarna kommer om inte annat anges från <a href="https://tatoeba.org">https://tatoeba.org</a>.
            </p>
          </div>
        </Col>
      </Grid>
    );
  }
}

grammarScreen.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

grammarScreen.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

export default Utility.superConnect(this, Reducers)(grammarScreen);
