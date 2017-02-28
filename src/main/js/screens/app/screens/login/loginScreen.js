import React from 'react';
import { Button, Col, Row, Grid, Form, Checkbox, CheckboxGroup, FieldGroup, FormGroup, FormControl, Input, HelpBlock, ControlLabel } from 'react-bootstrap';
// import MyLoginForm from './components/MyLoginForm';
// import MyRegistrationForm from './components/MyRegistrationForm';

import getCSRF from '../../../../shared/util/getcsrf';
import Utility from '../../../../shared/util/Utility';
import * as Security from '../../../../shared/stores/Security';

export const Reducers = [Security];

export class loginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      _csrf: getCSRF(),
      submitLogin: true,
      canSubmit: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  setLoginSubmitMode(submitLogin) {
    this.setState({
      submitLogin
    });
  }

  getValidationState() {
    // success, warning, error, or null
    if (this.haveFailedAuth()) {
      return 'error';
    } else if (this.haveSucceededAuth()) {
      return 'success';
    }

    return null;
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(formData) {
    formData.preventDefault();

    if (this.state.submitLogin) {
      this.props.requestUserLogin(formData, this.props.location.query.redirectUrl);
    } else {
      this.props.requestUserRegister(formData, this.props.location.query.redirectUrl);
    }
  }

  haveSucceededAuth() {
    if (
    !this.props.loginInProgress &&
    !this.props.registerInProgress &&
    this.props.authSuccess &&
    this.props.authResponse !== '') {
      return true;
    }
    return false;
  }

  haveFailedAuth() {
    if (
    !this.props.loginInProgress &&
    !this.props.registerInProgress &&
    !this.props.authSuccess &&
    this.props.authResponse !== '') {
      return true;
    }
    return false;
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col mdOffset={2} md={8}>
            <Form onSubmit={this.handleSubmit}>
              <fieldset>
                <FormGroup
                  controlId="formBasicText"
                  validationState={this.getValidationState()}
                >
                  <legend>Logga in eller registrera dig</legend>
                  { this.props.authResponse && this.getValidationState() ? <ControlLabel>{this.props.authResponse}</ControlLabel> : null }
                </FormGroup>
                <FormGroup>
                  <FormControl
                    type="text"
                    name="username"
                    placeholder="Användarnamn"
                    value={this.state.username}
                    onChange={this.handleInputChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup>
                  <FormControl
                    type="password"
                    name="password"
                    placeholder="Lösenord"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
                <FormControl
                  type="hidden"
                  name="_csrf"
                  value={this.state._csrf}
                />

                <FormGroup>
                  <Button label="login" onClick={() => this.setLoginSubmitMode(true)} bsStyle="primary" name="login" type="submit" disabled={!this.state.username || !this.state.password}>
                      Logga in
                    </Button>
                  {' '}
                  <Button label="login" onClick={() => this.setLoginSubmitMode(false)} bsStyle="success" name="register" type="submit" disabled={!this.state.username || !this.state.password}>
                      Registrera
                    </Button>
                </FormGroup>
              </fieldset>
            </Form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

loginScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

loginScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);

export default Utility.superConnect(this, Reducers)(loginScreen);
