/* global document fetch */

import React from 'react';
import 'whatwg-fetch';
import { connect } from 'react-redux';
import { Col, Grid, Row } from 'react-bootstrap';
import MyLoginForm from './components/MyLoginForm';
import MyRegistrationForm from './components/MyRegistrationForm';

import * as Security from '../../../../shared/stores/Security';

export class Login extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Grid>
        <Row>
          <Col xsOffset={0} xs={12} smOffset={3} sm={6} mdOffset={4} md={4}>
            <h2>Logga in</h2>
            <MyLoginForm />
            <MyRegistrationForm />
          </Col>
        </Row>
      </Grid>
    );
  }
}

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    // Selects which state properties are merged into the component's props
    state => (state.security),
    // Selects which action creators are merged into the component's props
    Security.actionCreators
)(Login);
