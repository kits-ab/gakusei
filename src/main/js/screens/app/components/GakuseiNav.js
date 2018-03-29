import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, withRouter } from 'react-router';

import Utility from '../../../shared/util/Utility';
import * as Security from '../../../shared/reducers/Security';
import * as Lessons from '../../../shared/reducers/Lessons';

export const Reducers = [Lessons, Security];

export class GakuseiNav extends React.Component {
  render() {
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
                title="Glosor"
                id="basic-nav-dropdown"
              >
                <LinkContainer to="/select/guess">
                  <MenuItem className="guessPlay">Gissa ordet</MenuItem>
                </LinkContainer>
                <LinkContainer to="/select/translate">
                  <MenuItem className="translatePlay">Översätt ordet</MenuItem>
                </LinkContainer>
                <LinkContainer to="/select/flashcards">
                  <MenuItem className="flashcardPlay">Bildkort</MenuItem>
                </LinkContainer>
                {/* Remove this comment when feature is done
                  <LinkContainer to="/select/kanji">
                  <MenuItem className="kanjiPlay">Skriv Kanji</MenuItem>
                </LinkContainer> */}
              </NavDropdown>
              <NavDropdown
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
              </NavDropdown>
              <LinkContainer to="/select/quiz">
                <NavItem className="quizPlay">Quiz</NavItem>
              </LinkContainer>
              {/* <LinkContainer to="/lists">
                <NavItem>Lista ord</NavItem>
              </LinkContainer> */}
              <LinkContainer to="/about">
                <NavItem className="about">Om Gakusei</NavItem>
              </LinkContainer>
            </Nav>
          ) : (
            <Nav>
              <LinkContainer to="/about">
                <NavItem>Om Gakusei</NavItem>
              </LinkContainer>
            </Nav>
          )}
          {this.props.loggedIn ? (
            <Nav pullRight>
              <NavItem className="logged-in-text">Inloggad som: {this.props.loggedInUser}</NavItem>
              <LinkContainer to={{ pathname: '/logout', query: { currentUrl: this.props.location.pathname } }}>
                <NavItem className="logoutButton">Logga ut</NavItem>
              </LinkContainer>
            </Nav>
          ) : (
            <Nav pullRight>
              <LinkContainer to={`/login${this.props.location.search}`}>
                <NavItem>Logga in / Registrera</NavItem>
              </LinkContainer>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

GakuseiNav.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

GakuseiNav.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);
export default Utility.superConnect(this, Reducers)(withRouter(GakuseiNav));
