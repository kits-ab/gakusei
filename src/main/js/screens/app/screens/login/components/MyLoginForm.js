import React from 'react';
import { connect } from 'react-redux';
// import { LocalForm } from 'react-redux-form';
// import Formsy from 'formsy-react';
// import { Input, Form, Button, ControlLabel, FormControl, FormGroup, Control } from 'formsy-react-components';
import FRC from 'formsy-react-components';

import Utility from '../../../../../shared/util/Utility';
import getCSRF from '../../../../../shared/util/getcsrf';
import * as Security from '../../../../../shared/stores/Security';

export const Reducers = [Security];

const { Checkbox, CheckboxGroup, Input, RadioGroup, Row, Select, File, Textarea } = FRC;

let myform = null;

export class MyLoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(event) {
    this.props.requestUserLogin(event);
  }

  render() {
    return (
      <div>
        <FRC.Form ref={(form) => { myform = form; }} onValidSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
          <fieldset>
            <legend>Redan registrerad?</legend>
            <Input type="text" name="username" placeholder="Skriv ditt användarnamn här" />
            <Input
              type="password" name="password" placeholder="Skriv ditt lösenord här"
            />
            <Input type="hidden" name="_csrf" value={getCSRF()} />

            <button className="btn btn-default">Logga in</button>
          </fieldset>
        </FRC.Form>
      </div>
    );
  }
}

MyLoginForm.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

MyLoginForm.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);

// Wire up the React component to the Redux store and export it when importing this file
export default Utility.superConnect(this, Reducers)(MyLoginForm);
