import * as Security from '../../../../shared/reducers/Security';
import * as Lessons from '../../../../shared/reducers/Lessons';
import Utility from '../../../../shared/util/Utility';
import {Col, DropdownButton, Grid, MenuItem, FormGroup,} from 'react-bootstrap';


export const Reducers = [Lessons, Security];

export class settingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state={
        options: {reading: {text: 'Japanska' },swedish:{text: 'Svenska' }}
    };
  }
    HandleSelect(languageType, input) {
      switch(languageType) {
          case 'questionLang': this.props.setQuestionLanguage(input);
                for(let key in this.state.options){if(key !== input){this.props.setAnswerLanguage(key)}}
                break;
          case 'answerLang': this.props.setAnswerLanguage(input);
                break;
      }
    }
  fromLangButton() {


      const SelectionButton = props => {
          return (
              <DropdownButton
                  id={props.name}
                  name={props.name}
                  title={props.title}
                  onSelect={this.HandleSelect.bind(this, props.languageType)}//this = eventKey
              >
                  {Object.keys(this.state.options).map(key => {
                      if (props.languageType === 'answerLang' && key === this.props.questionType) {
                          return null
                      }else{
                      return (
                              <MenuItem
                                  key={key}
                                  eventKey={key}>
                                  {this.state.options[key].text}
                              </MenuItem>
                          )}
                  })}

              </DropdownButton>
          );
      };
      return (
          <FormGroup controlId="languageSelect">
              <span>Standard språk: </span>
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
