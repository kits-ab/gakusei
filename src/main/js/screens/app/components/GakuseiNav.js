import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, NavbarBrand, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import * as Security from '../../../shared/stores/Security';
import * as Lessons from '../../../shared/stores/Lessons';

export class GakuseiNav extends React.Component {
  constructor(props) {
    super(props);

    this.eventHandler = this.eventHandler.bind(this);
  }

  eventHandler(eventKey) {
    switch (eventKey) {
      case 1.1:
        // this.props.setGameMode('/play/guess');
        this.props.setPageByName('/select/guess'); break;
      case 1.2:
        this.props.setPageByName('/select/translate'); break;
      case 1.3:
        // this.props.setGameMode('/play/quiz');
        this.props.setPageByName('/select/quiz'); break;
      case 2:
        this.props.setPageByName('/lists'); break;
      case 3:
        this.props.setPageByName('/about'); break;
      case 4:
        this.props.setPageByName('/profile'); break;
      default:
        this.props.setPageByName('/');
    }
  }

  render() {
    return (
      <Navbar onSelect={this.eventHandler} inverse collapseOnSelect>
        <Navbar.Header>
          <NavbarBrand>
            <button className="brandButton" onClick={this.eventHandler}>
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
            <NavItem eventKey={4} href="#">Inloggad som: {this.props.loggedInUser}</NavItem>
            <LinkContainer to="/logout">
              <NavItem eventKey={5}>Logga ut</NavItem>
            </LinkContainer>
          </Nav>
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
