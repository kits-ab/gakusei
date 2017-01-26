import React from 'react';
import { Navbar, Nav, NavItem, NavbarBrand, NavDropdown, MenuItem } from 'react-bootstrap';

const GakuseiNav = (props) => {
  const updater = props.switchPage;
  const eventHandler = (eventKey) => {
    if (eventKey === 0) {
      updater('LandingPage');
    } else if (eventKey === 1.1) {
      updater('LessonSelection', { gamemode: 'GuessPlayPage' });
    } else if (eventKey === 1.2) {
      updater('LessonSelection', { gamemode: 'TranslationPlayPage' });
    } else if (eventKey === 2) {
      updater('NuggetListPage');
    } else if (eventKey === 3) {
      updater('AboutPage');
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
          </NavDropdown>
          <NavItem eventKey={2} href="#">Lista ord</NavItem>
          <NavItem eventKey={3} href="#">Om Gakusei</NavItem>
        </Nav>
        <Nav pullRight>
          <Navbar.Text>Inloggad som: {props.username}</Navbar.Text>
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
