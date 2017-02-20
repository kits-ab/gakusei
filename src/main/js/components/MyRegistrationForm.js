import React from 'react';
import { connect } from 'react-redux';
// import { LocalForm } from 'react-redux-form';
// import Formsy from 'formsy-react';
// import { Input, Form, Button, ControlLabel, FormControl, FormGroup, Control } from 'formsy-react-components';
import FRC from 'formsy-react-components';
// import FormData from 'form-data';
import getCSRF from '../util/getcsrf';
import * as Store from '../Store';

const { Checkbox, CheckboxGroup, Input, RadioGroup, Row, Select, File, Textarea } = FRC;

let myform = null;

export class MyRegistrationForm extends React.Component {
  constructor(props) {
    super(props);


    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleSubmitRegistration = this.handleSubmitRegistration.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
  }

  enableButton() {
    this.setState({
      canSubmit: true
    });
  }
  disableButton() {
    this.setState({
      canSubmit: false
    });
  }

  handleSubmit(formData) {
    this.props.requestUserRegister(formData);
  }

  render() {
    return (
      <div>
        <FRC.Form ref={(form) => { myform = form; }} onValidSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
          <fieldset>
            <legend>Ny användare?</legend>
            <Input type="text" name="username" placeholder="Skriv ditt användarnamn här" />
            <Input
              type="password" name="password" placeholder="Skriv ditt lösenord här" validations="minLength:1"
              validationError="Your password must be at least 1 characters long."
            />
            <Input type="hidden" name="_csrf" value={getCSRF()} />

            <button className="btn btn-default">Registrera användare</button>
          </fieldset>
        </FRC.Form>
      </div>
    );
  }
}

MyRegistrationForm.propTypes = {
  // id: React.PropTypes.string.isRequired,
  // handleSubmit: React.PropTypes.func.isRequired,
  // btnText: React.PropTypes.string.isRequired
};


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
)(MyRegistrationForm);

