import { Grid, Row, Col, Jumbotron, Button, ButtonGroup } from 'react-bootstrap';
import ScrollableAnchor from 'react-scrollable-anchor';
import { translate } from 'react-i18next';

export class startScreen extends React.Component {
  render() {
    const { t, i18n } = this.props;

    return (
      <div>
        <Jumbotron className="introduction">
          <Grid className="introduction__container">
            <div className="introduction__text">
              <h1 className="introduction__title">{t('startScreen.header.introductionTitle')}</h1>
              <div className="text-center">
                <p>{t('readMore')}</p>
                <a href="#section1">
                  <img
                    src="/img/front_page/scrollButton2.svg"
                    alt="Scroll"
                    className="scrollButton__icon"
                  />
                </a>
              </div>
            </div>
          </Grid>
        </Jumbotron>
        <Jumbotron className="text-center">
          <h2>{t('startScreen.jumbotronBanner.colOne.h2')}</h2>
          <Button
            href={`login${this.props.location.search}`}
            bsStyle="success"
            bsSize="large"
          >
            {t('tryNow')}
          </Button>
        </Jumbotron>
        <ScrollableAnchor id={'section1'}>
          <Grid className="about-features">
            <Row className="features_prev">
              <Col
                xs={12}
                md={6}
                lg={4}
                className="text-center"
              >
                <img
                  src="/img/front_page/svja.svg"
                  alt="Språk komplement"
                  className="about-features__image"
                />
                <h3>{t('startScreen.aboutFeatureImage.colTwo.h3')}</h3>
                <p>{t('startScreen.aboutFeatureImage.colTwo.p')}</p>
                <p>
                  <Button
                    bsStyle="success"
                    href="http://daigaku.se/gakusei2.html"
                  >
                    {t('readMore')}
                  </Button>
                </p>
              </Col>
              <Col
                xs={12}
                md={6}
                lg={4}
                className="text-center"
              >
                <img
                  src="/img/front_page/devices.svg"
                  alt="Multipla enheter"
                  className="about-features__image"
                />
                <h3>{t('startScreen.aboutFeatureImage.colThree.h3')}</h3>
                <p>{t('startScreen.aboutFeatureImage.colThree.p')}</p>
              </Col>
              <div className="clearfix visible-md" />
              <Col
                xs={12}
                md={6}
                lg={4}
                className="text-center"
              >
                <img
                  src="/img/front_page/anonymous.svg"
                  alt="Anonymitet"
                  className="about-features__image"
                />
                <h3>{t('startScreen.aboutFeatureImage.colFour.h3')}</h3>
                <p>{t('startScreen.aboutFeatureImage.colFour.p')}</p>
              </Col>
              <div className="clearfix visible-lg" />
              <Col
                xs={12}
                md={6}
                lg={4}
                className="text-center"
              >
                <img
                  src="/img/front_page/quiz.svg"
                  alt="Quiz"
                  className="about-features__image"
                />
                <h3>
                  <strong>2</strong> {t('startScreen.aboutFeatureImage.colFive.h3')}
                </h3>
                <p>{t('startScreen.aboutFeatureImage.colFive.p')}</p>
                <Button
                  href={`login${this.props.location.search}`}
                  bsStyle="success"
                >
                  {t('register')}
                </Button>
              </Col>
              <div className="clearfix visible-md" />
              <Col
                xs={12}
                md={6}
                lg={4}
                className="text-center"
              >
                <img
                  src="/img/logo/temp_gakusei_logo.png"
                  alt="Gakusei logo"
                  className="about-features__logo"
                />
              </Col>
              <Col
                xs={12}
                md={6}
                lg={4}
                className="text-center"
              >
                <img
                  src="/img/front_page/brain.svg"
                  alt="Hjärna"
                  className="about-features__image"
                />
                <h3>Smart inlärningsteknologi</h3>
                <p>
                  Vårt system kommer ihåg hur du har svarat på frågor, på så sätt kan vi anpassa inlärningsmaterialet
                  efter dig.
                </p>
                <p>
                  <Button
                    bsStyle="success"
                    href="http://daigaku.se/gakusei2.html"
                  >
                    {t('Läs mer')}
                  </Button>
                </p>
              </Col>
            </Row>
          </Grid>
        </ScrollableAnchor>
        <Jumbotron>
          <Grid>
            <Row>
              <Col
                xs={12}
                md={8}
              >
                <h2>Daigaku Sverige utvecklar Gakusei</h2>
                <p>
                  Daigaku Sverige har som mål att främja undervisning i, och forskning om japanska. Idag måste man i
                  stor utsträckning lära sig japanska via engelska. Vi tror att det skulle vara en fördel om åtminstone
                  en del inlärning kan ske direkt från svenska till japanska. Därför har vi skapat Gakusei, den första
                  webbapplikationen som lär dig japanska via svenska!
                </p>
                <p>
                  <Button
                    bsStyle="success"
                    href="http://daigaku.se/"
                  >
                    {t('Läs mer')}
                  </Button>
                </p>
              </Col>
              <Col
                xs={6}
                md={4}
                className="text-center"
              >
                <img
                  src="/img/front_page/daigaku.svg"
                  alt="Gakusei logo"
                />
              </Col>
            </Row>
          </Grid>
        </Jumbotron>
        <Jumbotron className="text-center">
          <h2>Utöka din kunskap med Gakusei!</h2>
          <Button
            href={`login${this.props.location.search}`}
            bsStyle="success"
            bsSize="large"
          >
            Registrera dig nu!
          </Button>
        </Jumbotron>
      </div>
    );
  }
}

export default translate('translations')(startScreen);
