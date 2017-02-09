/* global document fetch */

import React from 'react';
import 'whatwg-fetch';
import { Col, Grid, Row } from 'react-bootstrap';
import Form from './Form';

const Login = (props) => {
  const loginSuccess = (username) => {
    props.setLoggedInUser(username);
    props.switchPage('LandingPage');
  };
  const resetForm = (formName) => {
    document.getElementById(formName).reset();
  };
  const createFormBody = (event, username) => {
    const formData = [];
    formData.push(`${encodeURIComponent('username')}=${encodeURIComponent(username)}`);
    formData.push(`${encodeURIComponent('password')}=${encodeURIComponent(event.target['1'].value)}`);
    formData.push(`${encodeURIComponent('_csrf')}=${encodeURIComponent(event.target['2'].value)}`);
    return formData.join('&');
  };
  const performLogin = (formBody, usernameFromForm, formName) => {
    fetch('/auth', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/xhtml+xml, application/xml, text/plain, text/html, */*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: formBody
    })
      .then(() => fetch('/username', { credentials: 'same-origin' }))
      .then(response => response.json())
      .then(json => json.username)
      .then(username => (username === usernameFromForm ? loginSuccess(username) : resetForm(formName)))
      .catch(ex => console.log('Fel vid inloggning', ex));
  };
  const register = (formBody, usernameFromForm, formName) => {
    fetch('/registeruser', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/xhtml+xml, application/xml, text/plain, text/html, */*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: formBody
    })
      .then(() => performLogin(formBody, usernameFromForm, formName))
      .catch(ex => console.log('Fel vid registrering av användare', ex));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formName = event.target.id;
    const usernameFromForm = event.target['0'].value;
    const formBody = createFormBody(event, usernameFromForm);
    const eventId = event.target.id;
    if (eventId === 'loginForm') {
      performLogin(formBody, usernameFromForm, formName);
    } else if (eventId === 'registerForm') {
      register(formBody, usernameFromForm, formName);
    }
  };
  return (
    <Grid>
      <Row>
        <Col xsOffset={0} xs={12} smOffset={3} sm={6} mdOffset={4} md={4}>
          <h2>Logga in</h2>
          <Form
            id="loginForm"
            btnText="Logga in"
            handleSubmit={handleSubmit}
            {...props}
          />
          <h2>Registrera användare</h2>
          <Form
            id="registerForm"
            btnText="Registrera användare"
            handleSubmit={handleSubmit}
            {...props}
          />
        </Col>
      </Row>
    </Grid>
  );
};

export default Login;
