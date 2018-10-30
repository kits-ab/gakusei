// eslint-disable-next-line no-unused-vars
/* global frontend_global_data */

import 'whatwg-fetch';
import { Grid, Row, Col, ListGroup, ListGroupItem, Panel, Button, Jumbotron } from 'react-bootstrap';
import xml2js from 'xml2js';
import { translate } from 'react-i18next';

export class aboutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backend_licenses: '',
      frontend_licenses: '',
      license_url: {
        MIT: 'https://opensource.org/licenses/mit-license.php',
        'BSD-3-Clause': 'https://opensource.org/licenses/BSD-3-Clause',
        LGPL: 'https://opensource.org/licenses/LGPL-2.1'
      }
    };
    // debugger;
  }
  componentDidMount() {
    this.fetchBackendLicenses();
    this.fetchFrontendLicenses();
  }

  createFrontendLicenses(licenses) {
    this.setState({
      frontend_licenses: Object.keys(licenses).map(licenseName => (
        <ListGroupItem key={licenseName}>
          Modul: {licenseName.split('@')[0]}
          <br />
          Version: {licenseName.split('@')[1]}
          <br />
          Repository: {licenses[licenseName].repository}
          <br />
          Licens(er):
          <div key={this.state.license_url[licenses[licenseName].licenses] + licenses[licenseName].licenses}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                this.state.license_url[licenses[licenseName].licenses] ||
                `http://www.google.com/search?q=${licenses[licenseName].licenses}`
              }
            >
              {licenses[licenseName].licenses}
            </a>
          </div>
        </ListGroupItem>
      ))
    });
  }

  createBackendLicenses(xmldoc) {
    let dep = '';
    xml2js.parseString(xmldoc, (err, result) => {
      dep = result.licenseSummary.dependencies[0].dependency;
      dep.forEach(d => {
        const dependency = Object.assign({}, d);
        if (!d.licenses[0].license) {
          dependency.licenses[0] = {
            license: [
              {
                name: ['No license specified'],
                url: ['']
              }
            ]
          };
        } else if (!d.licenses[0].license[0].url) {
          dependency.licenses[0].license[0] = {
            name: dependency.licenses[0].license[0].name[0],
            url: ''
          };
        }
      });
    });
    const produceLicenses = licenses =>
      licenses.map(l => (
        <div key={l.url[0] + l.name[0]}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={l.url[0]}
          >
            {l.name[0]}
          </a>
        </div>
      ));
    this.setState({
      backend_licenses: dep.map(d => (
        <ListGroupItem key={d.groupId[0] + d.artifactId[0]}>
          Modul: {d.groupId[0]} : {d.artifactId[0]}
          <br />
          Version: {d.version[0]}
          <br />
          Licens(er): {produceLicenses(d.licenses[0].license)}
        </ListGroupItem>
      ))
    });
  }
  fetchBackendLicenses() {
    fetch('license/licenses.xml')
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then(xmlobj => new XMLSerializer().serializeToString(xmlobj))
      .then(xmldoc => this.createBackendLicenses(xmldoc));
  }
  fetchFrontendLicenses() {
    fetch('license/frontend_licenses.json')
      .then(response => response.json())
      .then(json => this.createFrontendLicenses(json));
  }

  render() {
    const { t, i18n } = this.props;

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <div className="text-left">
                <h2>{t('aboutGakusei.aboutGakusei.h2')}</h2>
                <p>{t('aboutGakusei.aboutGakusei.p')}</p>
                <ol>
                  <li>{t('aboutGakusei.aboutGakusei.li1')}</li>
                  <li>{t('aboutGakusei.aboutGakusei.li2')}</li>
                  <li> {t('aboutGakusei.aboutGakusei.li3')}</li>
                  <li> {t('aboutGakusei.aboutGakusei.li4')}</li>
                </ol>
                <br />
                <h4>{t('aboutGakusei.rights.h4')}</h4>
                <p>
                  {t('aboutGakusei.rights.p')}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://kits.se/"
                  >
                    {t('aboutGakusei.rights.link')}
                  </a>
                  . {t('aboutGakusei.rights.p2')}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="http://daigaku.se/"
                  >
                    Daigaku.se
                  </a>{' '}
                  {t('aboutGakusei.rights.p3')}
                </p>
                <br />
                <h4>{t('aboutGakusei.licenses.licens')}</h4>
                <p>
                  {' '}
                  {t('aboutGakusei.licenses.p')}{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://opensource.org/licenses/mit-license.php"
                  >
                    {t('aboutGakusei.licenses.link')}
                  </a>
                  . {t('aboutGakusei.licenses.p2')}
                </p>
                <Panel>
                  <Panel.Heading>
                    <Panel.Title toggle>{t('aboutGakusei.licenses.panelToggle')}</Panel.Title>
                  </Panel.Heading>
                  <Panel.Collapse>
                    <Panel.Body>
                      <ListGroup>
                        {this.state.backend_licenses}
                        {this.state.frontend_licenses}
                      </ListGroup>
                    </Panel.Body>
                  </Panel.Collapse>
                </Panel>
                <div>
                  <Row>
                    <Col
                      xs={12}
                      md={6}
                      lg={4}
                    >
                      {t('aboutGakusei.licenses.modul')}:{' '}
                      <a href="http://www.tanos.co.uk/jlpt/"> The Japanese Language Proficiency Test (JLPT)</a>
                      <br />
                      {t('aboutGakusei.licenses.licenses')}:<br />
                      <a href="https://creativecommons.org/licenses/by/2.5/">Creative Commons BY</a>
                      <br />
                      <br />
                    </Col>
                    <Col
                      xs={12}
                      md={6}
                      lg={4}
                    >
                      {t('aboutGakusei.licenses.modul')}: <a href="http://www.edrdg.org/edrdg/index.html">JMDict</a>
                      <br />
                      {t('aboutGakusei.licenses.licenses')}:<br />
                      <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col
                      xs={12}
                      md={6}
                      lg={4}
                    >
                      {t('aboutGakusei.licenses.modul')}: <a href="http://www.edrdg.org/edrdg/index.html">KanjiDict</a>
                      <br />
                      {t('aboutGakusei.licenses.licenses')}:<br />
                      <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>
                      <br />
                      <br />
                    </Col>
                    <Col
                      xs={12}
                      md={6}
                      lg={4}
                    >
                      {t('aboutGakusei.licenses.modul')}: <a href="https://kanjivg.tagaini.net/">KanjiVG</a>
                      <br />
                      {t('aboutGakusei.licenses.repo')}:{' '}
                      <a href="https://github.com/KanjiVG/kanjivg">https://github.com/KanjiVG/kanjivg</a>
                      <br />
                      {t('aboutGakusei.licenses.licenses')}:<br />
                      <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>

          <Grid className="about-features">
            <Row className="features_prev">
              <Col
                xs={12}
                md={6}
                lg={4}
                className="text-center"
              >
                <img
                  src="/img/front_page/contributor-kits-gakusei.svg"
                  alt="contributors-page"
                  className="about-features__image"
                />
                <h3>{t('aboutGakusei.infoBanner.contributors.contributors')}</h3>
                <p>
                  {t('aboutGakusei.infoBanner.contributors.p3')}{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/kits-ab/gakusei/graphs/contributors"
                  >
                    {t('aboutGakusei.infoBanner.contributors.link2')}
                  </a>
                </p>
              </Col>
              <Col
                xs={12}
                md={6}
                lg={4}
                className="text-center"
              >
                <img
                  src="/img/front_page/github-kits-gakusei-logo.svg"
                  alt="GitHub-Sida"
                  className="about-features__image"
                />
                <h3>{t('aboutGakusei.infoBanner.github.github')}</h3>
                <p>
                  {t('aboutGakusei.infoBanner.github.p')}{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/kits-ab/gakusei/"
                  >
                    {t('aboutGakusei.infoBanner.github.link')}
                  </a>
                </p>
              </Col>
              <Col
                xs={12}
                md={6}
                lg={4}
                className="text-center"
              >
                <img
                  src="/img/front_page/owner-kits-gakusei.svg"
                  alt="owner"
                  className="about-features__image"
                />
                <h3>{t('aboutGakusei.infoBanner.owner.owner')}</h3>
                <p> {t('aboutGakusei.infoBanner.owner.p')}</p>
              </Col>
            </Row>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default translate('translations')(aboutScreen);
