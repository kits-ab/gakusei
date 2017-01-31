import React from 'react';
import { Navbar, Nav, NavItem, NavbarBrand, NavDropdown, MenuItem } from 'react-bootstrap';

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
              <img height="100%" src="/img/temp_gakusei_logo3.png" alt="Gakusei logo" />
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
          <NavItem eventKey={4} href="#">Inloggad som: {props.username}</NavItem>
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
  username: React.PropTypes.string
};

GakuseiNav.defaultProps = {
  username: 'No one'
};

export default GakuseiNav;
