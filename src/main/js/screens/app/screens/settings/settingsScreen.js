import * as Security from '../../../../shared/reducers/Security';
import * as Lessons from '../../../../shared/reducers/Lessons';
import Utility from '../../../../shared/util/Utility';
//import Panel from "react-bootstrap/es/Panel";
import {Col, DropdownButton, Grid, MenuItem, Panel, Row, FormGroup, Radio, ControlLabel} from 'react-bootstrap';
import ToggleButton from "react-toggle-button";

export const Reducers = [Lessons, Security];

export class settingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }
    HandleSelect(input, languageType) {

    }
  fromLangButton() {
      const options=[{ id: 'reading', text: 'Japanska' },{ id: 'swedish', text: 'Svenska' }];
      const title = options.find(item => item.id === this.props.questionType);
      const Derp = props => {
          const setLanguage = (languageType) => {
              this.props.setQuestionLanguage(questionLanguage);
              this.props.setAnswerLanguage(answerLanguage);
          };
          return (
              <DropdownButton
                  title={title.text}
                  onSelect={(eventKey) => this.props.setQuestionLanguage(eventKey)}
              >
                  {options.map((item, i) => (
                      <MenuItem
                          key={i}
                          eventKey={item.id}>
                          {item.text}
                      </MenuItem>
                  ))}
              </DropdownButton>
          );
      };
      return (
          <FormGroup controlId="languageSelect">
          <Derp
              key={'UIlang'}
              name={'languageSelect'}
              languageType={'questionLang'}
          />
          <Derp
              key={'AnswerLang'}
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
