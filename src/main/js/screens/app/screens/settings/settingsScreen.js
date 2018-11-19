import * as Security from '../../../../shared/reducers/Security';
import * as Lessons from '../../../../shared/reducers/Lessons';
import Utility from '../../../../shared/util/Utility';
import { Col, DropdownButton, Grid, MenuItem, FormGroup } from 'react-bootstrap';

import { translate } from 'react-i18next';
import { AppScreen } from '../../AppScreen';

export const Reducers = [Lessons, Security];

export class settingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        reading: { text: `${this.translate('gakuseiNav.jp')}` },
        swedish: { text: `${this.translate('gakuseiNav.swe')}` }
      }
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
                  {this.state.options[key].text}
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
          title={this.state.options[this.props.questionType].text}
          name={'languageSelect'}
          languageType={'questionLang'}
        />
        <span> → </span>
        <SelectionButton
          key={'AnswerLang'}
          title={this.state.options[this.props.answerType].text}
          name={'languageSelect'}
          languageType={'answerLang'}
        />
      </FormGroup>
    );
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
      </div>
    );
  }
}
settingsScreen.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

settingsScreen.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

export default translate('translations')(Utility.superConnect(this, Reducers)(settingsScreen));
