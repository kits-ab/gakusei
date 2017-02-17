import React from 'react';
import { connect } from 'react-redux';
// import { LocalForm } from 'react-redux-form';
// import Formsy from 'formsy-react';
// import { Input, Form, Button, ControlLabel, FormControl, FormGroup, Control } from 'formsy-react-components';
import FRC from 'formsy-react-components';
import getCSRF from '../util/getcsrf';
import * as Store from '../Store';
import * as Test from '../Test';

const { Checkbox, CheckboxGroup, Input, RadioGroup, Row, Select, File, Textarea } = FRC;

let myform = null;

export class MyLoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.doTest = this.doTest.bind(this);
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
    debugger;
    this.props.requestUserLogin(event);
  }

  doTest() {
    console.log('Hello world');
    this.props.doThirdTest();
    console.log(this.props.atest);
  }

  render() {
    return (
      <div>
        <span onClick={this.doTest}>Testing</span>
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

MyLoginForm.propTypes = {
  // id: React.PropTypes.string.isRequired,
  // handleSubmit: React.PropTypes.func.isRequired,
  // btnText: React.PropTypes.string.isRequired
};

// Selects which state properties are merged into the component's props
function mapStateToProps(state) {
  return Object.assign({},
      state.Main,
      state.Test);
}

// Selects which action creators are merged into the component's props
function mapActionCreatorsToProps() {
  return Object.assign({},
      Store.actionCreators,
      Test.actionCreators);
}

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    mapStateToProps,
    mapActionCreatorsToProps
)(MyLoginForm);

