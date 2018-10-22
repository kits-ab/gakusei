import * as Security from '../../../../shared/reducers/Security';
import * as Lessons from '../../../../shared/reducers/Lessons';
import Utility from '../../../../shared/util/Utility';
import {Col, DropdownButton, Grid, MenuItem, FormGroup,} from 'react-bootstrap';


export const Reducers = [Lessons, Security];

export class settingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }
    HandleSelect(languageType, input) {
      languageType === 'questionLang' ? (this.props.setQuestionLanguage(input)) : (this.props.setAnswerLanguage(input));
    }
  fromLangButton() {
      const options={reading: {text: 'Japanska' },swedish:{text: 'Svenska' }};

      const SelectionButton = props => {
          return (
              <DropdownButton
                  name={props.name}
                  title={props.title}
                  onSelect={this.HandleSelect.bind(this, props.languageType)}//this = eventKey(options.id)
              >
                  {Object.keys(options).map(key => {
                      if (props.languageType === 'answerLang' && key === this.props.questionType) {
                          return null
                      }else{
                      return (
                              <MenuItem
                                  key={key}
                                  eventKey={key}>
                                  {options[key].text}
                              </MenuItem>
                          )}
                  })}

              </DropdownButton>
          );
      };
      return (
          <FormGroup controlId="languageSelect">
          <SelectionButton
              key={'UIlang'}
              title={options[this.props.questionType].text}
              name={'languageSelect'}
              languageType={'questionLang'}
          />
          <SelectionButton
              key={'AnswerLang'}
              title={options[this.props.answerType].text}
              name={'languageSelect'}
              languageType={'answerLang'}
          />
      </FormGroup>
      )
  }

  render() {
    return (
      <div>
        <Grid>
          <Col>
            <h1>Inställningar</h1>
            <h3>Språkalternativ</h3>
            <div>
                <FormGroup>
              {this.fromLangButton()}
                </FormGroup>
            </div>
          </Col>
        </Grid>
      </div>
    );
  }
}
settingsScreen.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

settingsScreen.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

export default Utility.superConnect(this, Reducers)(settingsScreen);
