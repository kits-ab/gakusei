import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, NavbarBrand, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import * as Security from '../../../shared/stores/Security';
import * as Lessons from '../../../shared/stores/Lessons';

export class GakuseiNav extends React.Component {
  constructor(props) {
    super(props);
  }

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

GakuseiNav.propTypes = {
  // action creators
  setPageByName: React.PropTypes.func.isRequired,
  loggedInUser: React.PropTypes.string.isRequired
};

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    // Selects which state properties are merged into the component's props
    state => (Object.assign({}, state.security, state.lessons)),
    // Selects which action creators are merged into the component's props
    Object.assign({}, Security.actionCreators, Lessons.actionCreators)
)(GakuseiNav);
