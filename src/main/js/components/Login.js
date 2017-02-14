/* global document fetch */

import React from 'react';
import 'whatwg-fetch';
import { connect } from 'react-redux';
import { Col, Grid, Row } from 'react-bootstrap';
import Form from './Form';

import * as Store from '../Store';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // loginSuccess(username) {
  //   this.setLoggedInUser(username);
  //   this.props.setPageByName('/');
  // }
  // resetForm(formName) {
  //   document.getElementById(formName).reset();
  // }
  // createFormBody(event, username) {
  //   const formData = [];
  //   formData.push(`${encodeURIComponent('username')}=${encodeURIComponent(username)}`);
  //   formData.push(`${encodeURIComponent('password')}=${encodeURIComponent(event.target['1'].value)}`);
  //   formData.push(`${encodeURIComponent('_csrf')}=${encodeURIComponent(event.target['2'].value)}`);
  //   return formData.join('&');
  // }
  // performLogin(formBody, usernameFromForm, formName) {
  //   fetch('/auth', {
  //     method: 'POST',
  //     credentials: 'same-origin',
  //     headers: {
  //       Accept: 'application/xhtml+xml, application/xml, text/plain, text/html, */*',
  //       'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  //     },
  //     body: formBody
  //   })
  //     .then(() => fetch('/username', { credentials: 'same-origin' }))
  //     .then(response => response.json())
  //     .then(json => (
  //       json.loggedIn === true && json.username === usernameFromForm ?
  //         loginSuccess(json.username) :
  //         resetForm(formName)))
  //     .catch(ex => console.log('Fel vid inloggning', ex));
  // }
  // register(formBody, usernameFromForm, formName) {
  //   fetch('/registeruser', {
  //     method: 'POST',
  //     credentials: 'same-origin',
  //     headers: {
  //       Accept: 'application/xhtml+xml, application/xml, text/plain, text/html, */*',
  //       'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  //     },
  //     body: formBody
  //   })
  //     .then(resp => (resp.status === 201 ? Promise.resolve(resp) : Promise.reject(new Error(resp.statusText))))
  //     .then(() => performLogin(formBody, usernameFromForm, formName))
  //     .catch(ex => console.log('Fel vid registrering av användare', ex));
  // }
  handleSubmit(event) {
    event.preventDefault();
    debugger;
    // const formName = event.target.id;
    // const usernameFromForm = event.target['0'].value;
    // const formBody = createFormBody(event, usernameFromForm);
    // const eventId = event.target.id;
    if (event.target.id === 'loginForm') {
      this.props.requestUserLogin(event.target);
      // performLogin(formBody, usernameFromForm, formName);
    } else if (event.target.id === 'registerForm') {
      this.props.requestUserRegister(event.target);
      // requestUserRegister(usernameFromForm, password, csrf)
      // register(formBody, usernameFromForm, formName);
    }
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xsOffset={0} xs={12} smOffset={3} sm={6} mdOffset={4} md={4}>
            <h2>Logga in</h2>
            <Form
              id="loginForm"
              btnText="Logga in"
              handleSubmit={this.handleSubmit}
              {...this.props}
            />
            <h2>Registrera användare</h2>
            <Form
              id="registerForm"
              btnText="Registrera användare"
              handleSubmit={this.handleSubmit}
              {...this.props}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    // Selects which state properties are merged into the component's props
    state => (state.reducer),
    // Selects which action creators are merged into the component's props
    Store.actionCreators
)(Login);
