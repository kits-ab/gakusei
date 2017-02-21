import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Utility from '../../../shared/util/Utility';
import * as Security from '../../../shared/stores/Security';
import * as Lessons from '../../../shared/stores/Lessons';

export const Reducers = [Lessons, Security];

export class GakuseiNav extends React.Component {
  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <button className="brandButton">
              <LinkContainer to="/">
                <span>
                  <img height="100%" src="/img/logo/temp_gakusei_logo3.png" alt="Gakusei logo" />
              Gakusei
              </span>
              </LinkContainer>
            </button>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavDropdown title="Spela" id="basic-nav-dropdown">
              <LinkContainer to="/select/guess">
                <MenuItem>Gissa ordet</MenuItem>
              </LinkContainer>
              <LinkContainer to="/select/translate">
                <MenuItem>Översätt ordet</MenuItem>
              </LinkContainer>
              <LinkContainer to="/select/quiz">
                <MenuItem>Quiz</MenuItem>
              </LinkContainer>
            </NavDropdown>
            <LinkContainer to="/lists">
              <NavItem>Lista ord</NavItem>
            </LinkContainer>
            <LinkContainer to="/about">
              <NavItem>Om Gakusei</NavItem>
            </LinkContainer>
          </Nav>
          {this.props.loggedIn === true ?
            <Nav pullRight>
              <LinkContainer to="/profile">
                <NavItem>Inloggad som: {this.props.loggedInUser}</NavItem>
              </LinkContainer>
              <LinkContainer to="/logout">
                <NavItem>Logga ut</NavItem>
              </LinkContainer>
            </Nav>
          :
            <Nav pullRight>
              <LinkContainer to="/login">
                <NavItem>Registrera användare</NavItem>
              </LinkContainer>
              <LinkContainer to="/login">
                <NavItem>Logga in</NavItem>
              </LinkContainer>
            </Nav>}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

GakuseiNav.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

GakuseiNav.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);

export default Utility.superConnect(this, Reducers)(GakuseiNav);
