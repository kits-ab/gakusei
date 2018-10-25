/* eslint-disable no-underscore-dangle */

import { Checkbox, Button, Col, Row, Grid, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import getCSRF from '../../../../shared/util/getcsrf';
import Utility from '../../../../shared/util/Utility';
import * as Security from '../../../../shared/reducers/Security';

export const Reducers = [Security];

export class loginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkboxChecked: false,
      username: '',
      password: '',
      _csrf: getCSRF(),
      submitLogin: true,
      canSubmit: false,
      invalidUsername: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    if (this.props.loggedIn) {
      this.props.setPageByName('/');
    } else {
      this.props.clearAuthResponse();
    }
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
  handleChange(e) {
    this.setState({ checkboxChecked: e.target.checked });
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'username') {
      this.validateUsername(e);
    }
  }
  validateUsername(e) {
    const regex = RegExp('[^A-Za-z0-9]+');
    this.setState({ invalidUsername: regex.test(e.target.value) });
  }

  handleSubmit(formData) {
    formData.preventDefault();

    if (this.state.submitLogin) {
      this.props.requestUserLogin(formData, this.props.redirectUrl || '/');
    } else {
      this.props.requestUserRegister(formData, this.props.redirectUrl || '/');
    }
  }

  haveSucceededAuth() {
    return (
      !this.props.loginInProgress &&
      !this.props.registerInProgress &&
      this.props.authSuccess &&
      this.props.authResponse !== ''
    );
  }
  haveFailedAuth() {
    return (
      !this.props.loginInProgress &&
      !this.props.registerInProgress &&
      !this.props.authSuccess &&
      this.props.authResponse !== ''
    );
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col
            mdOffset={0}
            md={4}
          >
            <div>
              <h4>Registrera dig snabbt och enkelt här</h4>
              <p>
                Vi sparar inga personuppgifter så var noga med att komma ihåg ditt lösenord då vi inte kan återställa
                det åt dig.
              </p>
              <p>
                Materialet är anpassat efter det svenska språket och du kan lära dig från svenska till japanska och
                japanska till svenska
              </p>
            </div>
          </Col>
          <Col
            mdOffset={1}
            md={4}
          >
            <Form onSubmit={this.handleSubmit}>
              <fieldset>
                <FormGroup
                  controlId="formBasicText"
                  validationState={this.getValidationState()}
                >
                  <legend>Logga in eller registrera dig</legend>
                  {this.props.authResponse && this.getValidationState() ? (
                    <ControlLabel name="authFeedback">{this.props.authResponse}</ControlLabel>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  {this.state.invalidUsername === true ? (
                    <p style={{ margin: '5%', color: 'darkred', fontWeight: 'bold' }}>
                      Användarnamnet får endast innehålla bokstäver och siffror.
                    </p>
                  ) : null}
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
                  <Button
                    label="login"
                    onClick={() => this.setLoginSubmitMode(true)}
                    bsStyle="primary"
                    name="login"
                    type="submit"
                    disabled={!this.state.username || !this.state.password}
                  >
                    Logga in
                  </Button>{' '}
                  <Button
                    label="login"
                    onClick={() => this.setLoginSubmitMode(false)}
                    bsStyle="success"
                    name="register"
                    type="submit"
                    disabled={!this.state.username || !this.state.password || this.state.invalidUsername}
                  >
                    Registrera
                  </Button>{' '}
                  <Checkbox
                    label="remember-me"
                    name="remember-me"
                    checked={this.state.checkboxChecked}
                    onChange={this.handleChange}
                  >
                    Håll mig inloggad
                  </Checkbox>{' '}
                </FormGroup>
              </fieldset>
            </Form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

loginScreen.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

loginScreen.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

export default Utility.superConnect(this, Reducers)(loginScreen);
