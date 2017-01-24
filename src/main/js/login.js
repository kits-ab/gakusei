import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Col, ControlLabel, FormControl, FormGroup, Grid, HelpBlock, Row } from 'react-bootstrap';
import getCSRF from './util/getcsrf';

const Form = props =>
  (
    <form method="post" action={props.actionName}>
      <FieldGroup
        id={props.usernameId}
        name="username"
        type="text"
        label="Användarnamn"
        placeholder="Skriv in ditt användarnamn här"
      />
      <FieldGroup
        id={props.passwordId}
        name="password"
        label="Lösenord"
        type="password"
        placeholder="Skriv in ditt lösenord här"
      />
      <FieldGroup
        id={props.csrfId}
        type="hidden"
        name="_csrf"
        value={getCSRF()}
      />
      <Button type="submit">
        {props.btnText}
      </Button>
    </form>
  );

const Login = () =>
  <Grid>
    <Row>
      <Col xsOffset={0} xs={12} smOffset={3} sm={6} mdOffset={4} md={4}>
        <h2>Logga in</h2>
        <Form actionName="/auth" usernameId="loginText" passwordId="loginText" csrfId="loginCSRF" btnText="Logga in" />
        <h2>Registrera användare</h2>
        <Form
          actionName="/registeruser"
          usernameId="regText"
          passwordId="regText"
          csrfId="regCSRF"
          btnText="Registrera användare"
        />
      </Col>
    </Row>
  </Grid>;

const FieldGroup = ({ id, label, help, ...props }) =>
  <FormGroup controlId={id}>
    <ControlLabel>{label}</ControlLabel>
    <FormControl {...props} />
    {help && <HelpBlock>{help}</HelpBlock>}
  </FormGroup>;

ReactDOM.render(<Login />, document.getElementById('login_root'));
