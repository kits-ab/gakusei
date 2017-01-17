import React from 'react';
import {Navbar, Nav, NavItem, NavbarBrand, NavDropdown, MenuItem} from 'react-bootstrap';

export default class GakuseiNav extends React.Component {
    constructor(props) {
        super(props);
    }
    eventHandler(eventKey){
        if (eventKey === 0) {
            this.props.updater('LandingPage')
        } else if (eventKey === 1.1) {
            this.props.updater('LessonSelection', '', 'GuessPlayPage')
        } else if (eventKey === 1.2) {
            this.props.updater('LessonSelection', '', 'TranslationPlayPage')
        } else if (eventKey === 2) {
            this.props.updater('NuggetListPage')
        } else if (eventKey === 3) {
            this.props.updater('AboutPage')
        }
    }
    render() {
        return (
            <Navbar onSelect={this.eventHandler.bind(this)} inverse collapseOnSelect>
                <Navbar.Header>
                    <NavbarBrand>
                        <span onClick={() => this.eventHandler(0)}><a href='#'><img height={'100%'}
                                               src='/img/temp_gakusei_logo3.png'
                                               alt='Gakusei logo'/></a>Gakusei</span>

                    </NavbarBrand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                    <NavDropdown eventKey={1} title='Spela' id='basic-nav-dropdown'>
                        <MenuItem eventKey={1.1}>Gissa ordet</MenuItem>
                        <MenuItem eventKey={1.2}>Översätt ordet</MenuItem>
                    </NavDropdown>
                    <NavItem eventKey={2} href='#'>Lista ord</NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={3} href='#'>Om Gakusei</NavItem>
                        {/*<Navbar.Text>*/}
                            {/*<Navbar.Link href='/logout'>Logga ut</Navbar.Link>*/}
                        {/*</Navbar.Text>*/}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
