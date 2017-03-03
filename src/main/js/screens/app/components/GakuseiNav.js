import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Link, withRouter } from 'react-router';

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
            <Link to="/">
              <span>
                <img height="100%" src="/img/logo/temp_gakusei_logo3.png" alt="Gakusei logo" />
                Gakusei
              </span>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.props.loggedIn ?
            <Nav>
              <NavDropdown title="Glosor" id="basic-nav-dropdown">
                <LinkContainer to="/select/guess">
                  <MenuItem>Gissa ordet</MenuItem>
                </LinkContainer>
                <LinkContainer to="/select/translate">
                  <MenuItem>Översätt ordet</MenuItem>
                </LinkContainer>
              </NavDropdown>
              <IndexLinkContainer to="/select/grammar">
                <NavItem disabled>Grammatik</NavItem>
              </IndexLinkContainer>
              <LinkContainer to="/select/quiz">
                <NavItem>Quiz</NavItem>
              </LinkContainer>
              {/* <LinkContainer to="/lists">
                <NavItem>Lista ord</NavItem>
              </LinkContainer>*/}
              <LinkContainer to="/about">
                <NavItem>Om Gakusei</NavItem>
              </LinkContainer>
            </Nav>
          :
            <Nav>
              <LinkContainer to="/about">
                <NavItem>Om Gakusei</NavItem>
              </LinkContainer>
            </Nav>
          }
          {this.props.loggedIn ?
            <Nav pullRight>
              <Navbar.Text>Inloggad som: {this.props.loggedInUser}</Navbar.Text>
              <LinkContainer to={{ pathname: '/logout', query: { currentUrl: this.props.location.pathname } }}>
                <NavItem>Logga ut</NavItem>
              </LinkContainer>
            </Nav>
          :
            <Nav pullRight>
              <LinkContainer to="/login">
                <NavItem>Logga in / Registrera</NavItem>
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
export default Utility.superConnect(this, Reducers)(withRouter(GakuseiNav));
