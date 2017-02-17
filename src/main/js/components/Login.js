/* global document fetch */

import React from 'react';
import 'whatwg-fetch';
import { connect } from 'react-redux';
import { Col, Grid, Row } from 'react-bootstrap';
import MyLoginForm from './MyLoginForm';
import MyRegistrationForm from './MyRegistrationForm';

import * as Store from '../Store';

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

// Selects which state properties are merged into the component's props
function mapStateToProps(state) {
  return Object.assign({},
      state.Main);
}

// Selects which action creators are merged into the component's props
function mapActionCreatorsToProps() {
  return Object.assign({},
      Store.actionCreators);
}

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    mapStateToProps,
    mapActionCreatorsToProps
)(Login);