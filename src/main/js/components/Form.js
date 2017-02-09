import React from 'react';
import { Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import getCSRF from '../util/getcsrf';

const Form = props =>
  <form id={props.id} onSubmit={props.handleSubmit}>
    <FieldGroup
      name="username"
      type="text"
      label="Användarnamn"
      placeholder="Skriv in ditt användarnamn här"
    />
    <FieldGroup
      name="password"
      label="Lösenord"
      type="password"
      placeholder="Skriv in ditt lösenord här"
    />
    <FieldGroup
      type="hidden"
      label=""
      name="_csrf"
      value={getCSRF()}
    />
    <Button type="submit">
      {props.btnText}
    </Button>
  </form>;

Form.propTypes = {
  id: React.PropTypes.string.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  btnText: React.PropTypes.string.isRequired
};

const FieldGroup = ({ label, ...props }) =>
  <FormGroup >
    <ControlLabel>{label}</ControlLabel>
    <FormControl {...props} />
  </FormGroup>;

FieldGroup.propTypes = {
  label: React.PropTypes.string.isRequired
};

export default Form;
