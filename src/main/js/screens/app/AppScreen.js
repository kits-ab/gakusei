import GakuseiNav from './components/GakuseiNav';
import InfoBanner from './components/InfoBanner';

import Utility from '../../shared/util/Utility';
import * as Security from '../../shared/reducers/Security';
import { Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AppProvider } from '../../AppProvider';
import { translate } from 'react-i18next';

export const Reducers = [Security];

export class AppScreen extends React.Component {
  componentWillMount() {
    this.props.fetchLoggedInUser();
    if (this.props.announcement != []) {
      this.props.fetchAnnouncement();
    }
  }

  componentDidUpdate() {
    if (this.props.announcement != []) {
      this.props.fetchAnnouncement();
    }
  }

  render() {
    const { t, i18n } = this.props;
    return (
      <div>
        <header>
          <InfoBanner />
          <GakuseiNav />
        </header>
        <main>{this.props.children}</main>
        <footer className="page-footer">
          <Grid>
            <Row>
              <Col
                xs={12}
                md={8}
              >
                <div className="sitemap">
                  <h1 className="sitemap__header">Sidnavigering</h1>
                  <Grid fluid>
                    <Row>
                      <Col
                        xs={12}
                        sm={6}
                      >
                        <h2 className="sitemap__group-title">Gakusei</h2>
                        <ul className="sitemap__group">
                          <li>
                            <Link to="/about">{t('appScreen.aboutUsLink')}</Link>
                          </li>
                          {/* <li>Kontakt</li>
                          <li>Vårt team</li> */}
                        </ul>
                      </Col>
                      <Col
                        xs={12}
                        sm={6}
                      >
                        {/* <h2 className="sitemap__group-title">Hjälp</h2>
                        <ul className="sitemap__group">
                          <li>FAQ</li>
                          <li>Användarvilkor</li>
                          <li>Integritetspolicy</li>
                        </ul> */}
                      </Col>
                    </Row>
                  </Grid>
                </div>
              </Col>
              <Col
                xs={12}
                md={4}
              >
                <p className="copyright-information">
                  <img
                    src="/img/logo/temp_gakusei_logo3.png"
                    alt="Gakusei logo"
                    className="copyright-information__logo"
                  />
                  <span className="copyright-information__text">{t('appScreen.copyrightText')}</span>
                </p>
              </Col>
            </Row>
          </Grid>
        </footer>
      </div>
    );
  }
}

AppScreen.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

AppScreen.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

export default translate('translations')(Utility.superConnect(this, Reducers)(AppScreen));
