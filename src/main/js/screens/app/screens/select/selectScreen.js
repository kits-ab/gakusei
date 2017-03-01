import React from 'react';
import { Button, Grid, Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import getCSRF from '../../../../shared/util/getcsrf';
import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/stores/Lessons';
import * as Security from '../../../../shared/stores/Security';

export const Reducers = [Lessons, Security];

export class selectScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lessonNames: [],
      questionType: 'reading',
      answerType: 'swedish',
      selectedLesson: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.props.fetchLessonNames(this.props.params.type)
      .catch(() => this.props.verifyUserLoggedIn());
  }

  // Triggers when we change between play types but remain in "selection" page
  componentWillReceiveProps(nextProps) {
    if (this.props.params.type !== nextProps.params.type) {
      this.props.fetchLessonNames(nextProps.params.type)
      .catch(() => this.props.verifyUserLoggedIn());
    }
  }

  handleChange(event) {
    switch (event.target.name) {
      case 'selectedLesson':
        this.props.setSelectedLesson(event.target.value);
        break;
      case 'questionType':
        this.props.setQuestionLanguage(event.target.value);
        break;
      case 'answerType':
        this.props.setAnswerLanguage(event.target.value);
        break;
      default:
        break;
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    try {
      if (this.props.params.type === 'translate') {
        this.props.fetchLesson(this.props.params.type)
      .then(() => {
        this.props.setPageByName('/translate');
      });
      } else {
        this.props.fetchLesson(this.props.params.type)
      .then(() => {
        this.props.setPageByName(`/play/${this.props.params.type}`);
      });
      }
    } catch (err) {
      this.props.verifyUserLoggedIn();
    }
  }

  getPageHeader() {
    if (this.props.params.type === 'quiz') {
      return <h1>Quiz</h1>;
    } else if (this.props.params.type === 'guess') {
      return <h1>Gissa ordet</h1>;
    } else if (this.props.params.type === 'translate') {
      return <h1>Översätt ordet</h1>;
    }
    return null;
  }

  render() {
    const options = this.props.lessonNames.map(name => <option key={name} value={name}>{name}</option>);
    let languageSelection;
    if (this.props.params.type === 'quiz') {
      languageSelection = <div />;
    } else {
      languageSelection = (
        <div>
          <ControlLabel>Välj frågespråk</ControlLabel>
          <FormControl
            componentClass="select"
            name="questionType"
            id="questionLanguageSelection"
            onChange={this.handleChange}
            value={this.props.questionType}
          >
            <option key={'reading'} value={'reading'}>Japanska</option>
            <option key={'swedish'} value={'swedish'}>Svenska</option>
          </FormControl>
          <ControlLabel>Välj svarspråk</ControlLabel>
          <FormControl
            componentClass="select"
            name="answerType"
            id="answerLanguageSelection"
            onChange={this.handleChange}
            value={this.props.answerType}
          >
            <option key={'swedish'} value={'swedish'}>Svenska</option>
            <option key={'reading'} value={'reading'}>Japanska</option>
          </FormControl>
        </div>);
    }
    return (
      <Grid className="text-center">
        <Row>
          {this.getPageHeader()}
        </Row>
        <Row>
          <Col xs={8} xsOffset={2} lg={4} lgOffset={4}>
            <form href="#" onSubmit={this.handleSubmit}>
              <FormGroup>
                <ControlLabel>Välj lista av frågor</ControlLabel>
                <FormControl
                  componentClass="select"
                  name="selectedLesson"
                  id="lessonSelection"
                  onChange={this.handleChange}
                  value={this.props.selectedLesson}
                >
                  {options}
                </FormControl>
                {languageSelection}
              </FormGroup>
              <Button type="submit">Starta</Button>
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

selectScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

selectScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);


export default Utility.superConnect(this, Reducers)(selectScreen);
