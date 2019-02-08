import * as Security from '../../../../shared/reducers/Security';
import * as Lessons from '../../../../shared/reducers/Lessons';
import Utility from '../../../../shared/util/Utility';
import { Col, DropdownButton, Grid, MenuItem, FormGroup, Form, Button, FormControl } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import React from 'react';
import swal from 'sweetalert';

import { translate } from 'react-i18next';

export const Reducers = [Lessons, Security];

export class settingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitPassChange = this.handleSubmitPassChange.bind(this);
    this.getOldPassValidationState = this.getOldPassValidationState.bind(this);
    this.getNewPassValidationState = this.getNewPassValidationState.bind(this);
    this.getRepeatPassValidationState = this.getRepeatPassValidationState.bind(this);

    this.state = {
      options: {
        reading: { text: '' },
        swedish: { text: '' }
      },
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
      trigger: false
    };
  }

  HandleSelect(languageType, input) {
    switch (languageType) {
      case 'questionLang':
        this.props.setQuestionLanguage(input);
        for (const key in this.state.options) {
          if (key !== input) {
            this.props.setAnswerLanguage(key);
          }
        }
        break;
      case 'answerLang':
        this.props.setAnswerLanguage(input);
        break;
    }
  }

  translate(input) {
    const { t, i18n } = this.props;
    return t(input);
  }

  fromLangButton() {
    const SelectionButton = props => {
      return (
        <DropdownButton
          id={props.name}
          name={props.name}
          title={props.title}
          onSelect={this.HandleSelect.bind(this, props.languageType)} //this = eventKey
        >
          {Object.keys(this.state.options).map(key => {
            if (props.languageType === 'answerLang' && key === this.props.questionType) {
              return null;
            } else {
              return (
                <MenuItem
                  key={key}
                  eventKey={key}
                >
                  {this.state.options[key] === this.state.options.reading
                    ? `${this.translate('gakuseiNav.jp')}`
                    : `${this.translate('gakuseiNav.swe')}`}
                </MenuItem>
              );
            }
          })}
        </DropdownButton>
      );
    };

    return (
      <FormGroup controlId="languageSelect">
        <span>{this.translate('gakuseiSettings.defaultLanguage')}</span>

        <SelectionButton
          key={'UIlang'}
          title={
            this.state.options[this.props.questionType] === this.state.options.reading
              ? `${this.translate('gakuseiNav.jp')}`
              : `${this.translate('gakuseiNav.swe')}`
          }
          name={'languageSelect'}
          languageType={'questionLang'}
        />
        <span> → </span>
        <SelectionButton
          key={'AnswerLang'}
          title={
            this.state.options[this.props.questionType] === this.state.options.reading
              ? `${this.translate('gakuseiNav.swe')}`
              : `${this.translate('gakuseiNav.jp')}`
          }
          name={'languageSelect'}
          languageType={'answerLang'}
        />
      </FormGroup>
    );
  }

  getOldPassValidationState() {
    if (this.state.oldPassword.match(' ')) return 'error';
    const length = this.state.oldPassword.length;
    if (length > 1) {
      return 'success';
    } else if (length > 0) {
      return 'error';
    } else {
      return null;
    }
  }

  getNewPassValidationState() {
    if (this.state.newPassword.match(' ')) {
      return 'error';
    }
    const length = this.state.newPassword.length;
    if (length > 1 && this.state.newPassword !== this.state.oldPassword) {
      return 'success';
    } else if (length > 0) {
      return 'error';
    } else {
      return null;
    }
  }

  getRepeatPassValidationState() {
    if (this.state.repeatPassword.match(' ')) return 'error';
    const length = this.state.repeatPassword.length;
    if (length > 1 && length < 101 && this.state.repeatPassword === this.state.newPassword) {
      return 'success';
    } else if (length === 1 || length > 100) {
      return 'error';
    } else {
      return null;
    }
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmitPassChange() {
    if (this.state.oldPassword === this.state.newPassword) {
      console.log(this.translate('gakuseiSettings.newPasswordNotBeSameAsOldPassword'));
    } else if (this.state.newPassword === this.state.repeatPassword) {
      const formData = new Object();
      formData.username = this.props.loggedInUser;
      formData.oldPass = this.state.oldPassword;
      formData.newPass = this.state.newPassword;
      const jsonFormData = JSON.stringify(formData);
      try {
        fetch('/api/changepassword', {
          method: 'post',
          credentials: 'same-origin',
          body: jsonFormData
        }).then(response => {
          switch (response.status) {
            case 406:
              swal(' ', this.translate('gakuseiSettings.WrongPasswordTryAgain'), 'error', {
                button: this.translate('gakuseiSettings.Ok')
              });
              break;
            case 200:
              swal(' ', this.translate('gakuseiSettings.successfullyChangedPassword'), 'success', {
                button: this.translate('gakuseiSettings.Ok')
              });
              break;
            default:
              throw new Error();
          }
          this.setState({
            oldPassword: '',
            newPassword: '',
            repeatPassword: ''
          });
        });
      } catch (error) {
        swal(' ', this.translate('gakuseiSettings.TechnicalIssue'), 'error', {
          button: this.translate('gakuseiSettings.Ok')
        });
      }
    } else {
      console.log(this.translate('gakuseiSettings.passwordNotMatch'));
    }
  }

  render() {
    return (
      <div>
        <Grid>
          <Col>
            <h1>{this.translate('gakuseiSettings.settings')}</h1>
            <h3>{this.translate('gakuseiSettings.languageOption')}</h3>
            <div>
              <FormGroup>{this.fromLangButton()}</FormGroup>
            </div>
          </Col>
        </Grid>
        <Grid>
          <Col>
            <h3 style={{ marginBottom: 20 }}>{this.translate('gakuseiSettings.changePassword')}</h3>
            <Form>
              <FormGroup
                data-tip={this.translate('gakuseiSettings.passwordValidation')}
                data-for="oldPassTooltip"
                controlId="formChangePassOld"
                validationState={this.getOldPassValidationState()}
                style={{ width: 300 }}
              >
                {this.getOldPassValidationState() !== 'success' && this.state.oldPassword.length > 0 ? (
                  <ReactTooltip
                    id="oldPassTooltip"
                    delayShow={500}
                    delayHide={1000}
                    place="top"
                    type="error"
                    effect="solid"
                  />
                ) : null}

                <FormControl
                  type="password"
                  name="oldPassword"
                  placeholder={this.translate('gakuseiSettings.oldPassword')}
                  value={this.state.oldPassword}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup
                data-tip={this.translate('gakuseiSettings.passwordDifferentPassword')}
                data-for="newPassTooltip"
                controlId="formChangePassNew"
                validationState={this.getNewPassValidationState()}
                style={{ width: 300 }}
              >
                {this.getNewPassValidationState() !== 'success' && this.state.newPassword.length > 0 ? (
                  <ReactTooltip
                    id="newPassTooltip"
                    delayShow={500}
                    delayHide={1000}
                    place="top"
                    type="error"
                    effect="solid"
                  />
                ) : null}
                <FormControl
                  type="password"
                  name="newPassword"
                  placeholder={this.translate('gakuseiSettings.newPassword')}
                  value={this.state.newPassword}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup
                data-tip={this.translate('gakuseiSettings.passwordNotMatch')}
                data-for="repeatPassTooltip"
                controlId="formChangePassRepeat"
                validationState={this.getRepeatPassValidationState()}
                style={{ width: 300 }}
              >
                {this.getRepeatPassValidationState() !== 'success' && this.state.repeatPassword.length > 0 ? (
                  <ReactTooltip
                    id="repeatPassTooltip"
                    delayShow={500}
                    delayHide={1000}
                    place="top"
                    type="error"
                    effect="solid"
                  />
                ) : null}
                <FormControl
                  type="password"
                  name="repeatPassword"
                  placeholder={this.translate('gakuseiSettings.repeatNewPassword')}
                  value={this.state.repeatPassword}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </Form>
          </Col>
          <Button
            type="submit"
            name="submitPassChange"
            bsStyle="success"
            onClick={this.handleSubmitPassChange}
            disabled={
              this.getOldPassValidationState() !== 'success' ||
              this.getNewPassValidationState() !== 'success' ||
              this.getRepeatPassValidationState() !== 'success'
            }
          >
            {this.translate('gakuseiSettings.submit')}
          </Button>
        </Grid>
      </div>
    );
  }
}
settingsScreen.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

settingsScreen.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

export default translate('translations')(Utility.superConnect(this, Reducers)(settingsScreen));
