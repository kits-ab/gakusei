import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, NavbarBrand, NavDropdown, MenuItem } from 'react-bootstrap';
import * as SecurityStore from '../store/Security';

const GakuseiNav = (props) => {
  const switchPage = props.switchPage;
  const eventHandler = (eventKey) => {
    switch (eventKey) {
      case 1.1: switchPage('LessonSelection', { gamemode: 'GuessPlayPage' }); break;
      case 1.2: switchPage('LessonSelection', { gamemode: 'TranslationPlayPage' }); break;
      case 1.3: switchPage('QuizSelection', { gamemode: 'QuizPlayPage' }); break;
      case 2: switchPage('NuggetListPage'); break;
      case 3: switchPage('AboutPage'); break;
      case 4: switchPage('UserStatisticsPage'); break;
      default: switchPage('LandingPage');
    }
  };
  return (
    <Navbar onSelect={eventHandler} inverse collapseOnSelect>
      <Navbar.Header>
        <NavbarBrand>
          <button className="brandButton" onClick={() => eventHandler(0)}>
            <span>
              <img height="100%" src="/img/logo/temp_gakusei_logo3.png" alt="Gakusei logo" />
              Gakusei
            </span>
          </button>
        </NavbarBrand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavDropdown eventKey={1} title="Spela" id="basic-nav-dropdown">
            <MenuItem eventKey={1.1}>Gissa ordet</MenuItem>
            <MenuItem eventKey={1.2}>Översätt ordet</MenuItem>
            <MenuItem eventKey={1.3}>Quiz</MenuItem>
          </NavDropdown>
          <NavItem eventKey={2} href="#">Lista ord</NavItem>
          <NavItem eventKey={3} href="#">Om Gakusei</NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={4} href="#">Inloggad som: {props.loggedInUser}</NavItem>
          <Navbar.Text>
            <Navbar.Link href="/logout">Logga ut</Navbar.Link>
          </Navbar.Text>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

GakuseiNav.propTypes = {
  switchPage: React.PropTypes.func.isRequired,
  // username: React.PropTypes.string,
    // used action creators
  // fetchLoggedInUser: React.PropTypes.func.isRequired,
  // loggedIn: React.PropTypes.bool.isRequired,
  loggedInUser: React.PropTypes.string.isRequired
};

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    state => state.security, // Selects which state properties are merged into the component's props
    { ...SecurityStore.actionCreators } // Selects which action creators are merged into the component's props
)(GakuseiNav);
