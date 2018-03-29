import React from 'react';
import { Grid, Row, Col, Jumbotron, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router';

export default class startScreen extends React.Component {
  render() {
    return (
      <div>
        <Jumbotron id="jumbotron_first">
          <Grid className="make_table">
            <div className="middle">
              <h1>
                <span className="highlight_black">Bli student och lär dig japanska!</span>
              </h1>
              <h3>
                <span className="highlight_black">
                  Ta del av Gakuseis inlärningsmaterial och lär dig japanska redan idag!
                </span>
              </h3>
            </div>
          </Grid>
        </Jumbotron>
        <Grid className="about_features">
          <div className="text-center">
            <h1>
              <i>Gakusei erbjuder olika funktioner som underlättar ditt lärande.</i>
            </h1>
            <Button
              href={`login${this.props.location.search}`}
              bsStyle="success"
              bsSize="large"
            >
              Testa redan nu!
            </Button>
          </div>
          <Row className="features_prev">
            <Col
              xs={12}
              md={6}
              lg={4}
              className="text-center"
            >
              <img
                src="/img/front_page/svja.svg"
                alt=""
              />
              <h2>Ett bra komplement till undervisning</h2>
              <p>Olika sorters övningar, anpassade efter japanskaundervisning på högskolenivå.</p>
            </Col>
            <Col
              xs={12}
              md={6}
              lg={4}
              className="text-center"
            >
              <img
                src="/img/front_page/devices.svg"
                alt=""
              />
              <h2>Gakusei överallt</h2>
              <p>Öva med Gakusei på mobilen! Fungerar lika på mobila enheter som på laptops.</p>
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
                alt=""
              />
              <h2>Anonymitet</h2>
              <p>Gakusei lagrar ingen personlig data om sina användare, det enda som behövs är ett användarnamn.</p>
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
                alt=""
              />
              <h2>
                <strong>2</strong> quizar
              </h2>
              <p>Prova våra quizar och se vad du kan om Japan.</p>
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
                alt=""
                className="gakuseiLogo"
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
                alt=""
              />
              <h2>Smart inlärningsteknologi</h2>
              <p>
                Vårt system kommer ihåg hur du har svarat på frågor, på så sätt kan vi anpassa inlärningsmaterialet
                efter dig.
              </p>
            </Col>
          </Row>
        </Grid>
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
                    Läs mer
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
                  alt=""
                />
              </Col>
            </Row>
          </Grid>
        </Jumbotron>
        <Jumbotron id="jumbotron_register">
          <Grid>
            <Row>
              <Col
                mdOffset={4}
                md={4}
                className="text-center"
              >
                <h3>Utöka din kunskap med Gakusei!</h3>
                <br />
                <ButtonGroup
                  vertical
                  block
                >
                  <Button
                    href={`login${this.props.location.search}`}
                    bsStyle="success"
                    bsSize="large"
                  >
                    Registrera dig nu!
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Grid>
        </Jumbotron>
        <Jumbotron id="jumbotron_footer">
          <Grid>
            <Row>
              <Col
                xs={6}
                md={4}
              >
                <img
                  src="/img/logo/temp_gakusei_logo2.png"
                  alt=""
                />
                <br />
                <span>© Gakusei 2017 - Alla rättigheter reserverade.</span>
              </Col>
              <Col
                xs={6}
                md={4}
              >
                <h4>Gakusei</h4>
                <ul className="links_ls">
                  <li>
                    <Link to="/about">Om oss</Link>
                  </li>
                  <li>Kontakt</li>
                  <li>Vårt team</li>
                </ul>
              </Col>
              <Col
                xs={6}
                md={4}
              >
                <h4>Hjälp</h4>
                <ul className="links_ls">
                  <li>FAQ</li>
                  <li>Användarvilkor</li>
                  <li>Integritetspolicy</li>
                </ul>
              </Col>
            </Row>
          </Grid>
        </Jumbotron>
      </div>
    );
  }
}
