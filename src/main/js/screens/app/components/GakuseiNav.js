import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, withRouter } from 'react-router-dom';

import Utility from '../../../shared/util/Utility';
import * as Security from '../../../shared/reducers/Security';
import * as Lessons from '../../../shared/reducers/Lessons';
import { translate, Trans } from 'react-i18next';
import AppScreen from '../index';

export const Reducers = [Lessons, Security];

export class GakuseiNav extends React.Component {
  render() {
    const changeLanguage = lng => {
      i18n.changeLanguage(lng);
    };

    const { t, i18n } = this.props;

    return (
      <Navbar
        inverse
        collapseOnSelect
      >
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">
              <span>
                <img
                  height="100%"
                  src="/img/logo/temp_gakusei_logo3.png"
                  alt="Gakusei logo"
                />
                Gakusei
              </span>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.props.loggedIn ? (
            <Nav>
              <NavDropdown
                className="glosorDropdown"
                title={t('gakuseiNav.vocablePlay')}
                id="basic-nav-dropdown"
              >
                <LinkContainer to="/select/guess">
                  <MenuItem className="guessPlay">{t('gakuseiNav.guessPlay')}</MenuItem>
                </LinkContainer>
                {/* <LinkContainer to="/select/translate">
                  <MenuItem className="translatePlay">Översätt ordet</MenuItem>
                </LinkContainer> */}
                <LinkContainer to="/select/flashcards">
                  <MenuItem className="flashcardPlay">{t('gakuseiNav.flashcardPlay')}</MenuItem>
                </LinkContainer>
              </NavDropdown>
              {/* <NavDropdown
                className="grammarDropdown"
                title="Grammatik"
                id="basic-nav-dropdown"
              >
                <LinkContainer to="/select/grammar">
                  <MenuItem className="grammarPlay">Böj verb</MenuItem>
                </LinkContainer>
                <LinkContainer to="/grammar">
                  <NavItem className="grammarHelp">Texter om grammatik</NavItem>
                </LinkContainer>
              </NavDropdown> */}

              <LinkContainer to="/select/kanji">
                <NavItem className="kanjiPlay">{t('gakuseiNav.kanjiPlay')}</NavItem>
              </LinkContainer>
              <LinkContainer to="/select/quiz">
                <NavItem className="quizPlay">{t('gakuseiNav.quizPlay')}</NavItem>
              </LinkContainer>
              {/* <LinkContainer to="/lists">
                  <NavItem>Lista ord</NavItem>
                </LinkContainer> */}
              <LinkContainer to="/about">
                <NavItem className="about">{t('gakuseiNav.about')}</NavItem>
              </LinkContainer>
            </Nav>
          ) : (
            <Nav>
              <LinkContainer to="/about">
                <NavItem>{t('gakuseiNav.about')}</NavItem>
              </LinkContainer>
            </Nav>
          )}
          <Nav>
            <NavDropdown
              className="glosorDropdown"
              id="basic-nav-dropdown"
              title={t('gakuseiNav.lang')}
            >
              <MenuItem onClick={() => changeLanguage('se')}>
                {t('gakuseiNav.swe')}
                <img
                  height="30px"
                  src="/img/flags/sweden-flag.svg"
                  alt="sweden"
                />
              </MenuItem>
              <MenuItem onClick={() => changeLanguage('jp')}>
                {t('gakuseiNav.jp')}
                <img
                  height="30px"
                  src="/img/flags/japan-flag.svg"
                  alt="japan"
                />
              </MenuItem>
            </NavDropdown>
          </Nav>

          {this.props.loggedIn ? (
            <Navbar.Text pullRight>
              {t('gakuseiNav.loggedIn')} {this.props.loggedInUser}
            </Navbar.Text>
          ) : null}
          <Nav pullRight>
            {this.props.loggedIn ? (
              <LinkContainer to={{ pathname: '/logout', query: { currentUrl: this.props.location.pathname } }}>
                <NavItem className="menu-button">{t('gakuseiNav.logout')}</NavItem>
              </LinkContainer>
            ) : (
              <LinkContainer to={`/login${this.props.location.search}`}>
                <NavItem className="menu-button">{t('gakuseiNav.signIn')}</NavItem>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

GakuseiNav.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

GakuseiNav.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);
export default translate('translations')(Utility.superConnect(this, Reducers)(withRouter(GakuseiNav)));
