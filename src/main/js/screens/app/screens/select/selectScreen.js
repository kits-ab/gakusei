import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { Button, Grid, Row, Col, FormGroup, FormControl, ControlLabel, ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap';
import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/stores/Lessons';
import * as Security from '../../../../shared/stores/Security';

export const Reducers = [Lessons, Security];

export class selectScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { startDate: moment() };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLanguageSelection = this.handleLanguageSelection.bind(this);
    this.handleStarredClick = this.handleStarredClick.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentWillMount() {
    this.props.fetchLessons(this.props.params.type)
      .catch(() => this.props.verifyUserLoggedIn());

    this.props.fetchUserStarredLessons()
      .catch(() => this.props.verifyUserLoggedIn());
  }

  // Triggers when we change between play types but remain in "selection" page
  componentWillReceiveProps(nextProps) {
    if (this.props.params.type !== nextProps.params.type) {
      this.props.fetchLessons(nextProps.params.type)
        .catch(() => this.props.verifyUserLoggedIn());
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

  handleLanguageSelection(event) {
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

  handleStarredClick(lesson) {
    return this.props.starredLessons.map(userLesson => userLesson.lessonName).includes(lesson.name) ?
      this.props.removeStarredLesson(lesson.name) :
      this.props.addStarredLesson(lesson.name);
  }

  handleDateChange(newMoment) {
    this.setState({ startDate: newMoment });
    console.log(newMoment.calendar());
  }

  render() {
    const options = this.props.lessons.map(lesson =>
      <Row key={lesson.name}>
        <Col xs={2} md={1} lg={1}>
          <Button
            bsStyle={this.props.starredLessons.map(userLesson => userLesson.lessonName).includes(lesson.name) ? 'warning' : null}
            onClick={() => this.handleStarredClick(lesson.name)}
          >
            <Glyphicon glyph="star" />
          </Button>
        </Col>
        <Col xs={10} md={11} lg={11}>
          <ListGroupItem
            key={lesson.name}
            onClick={() => this.props.setSelectedLesson(lesson)}
            value={lesson.name}
            bsStyle={lesson.name === this.props.selectedLesson ? 'info' : null}
            header={lesson.name}
          >
            Deadline at: {lesson.firstDeadline}
          </ListGroupItem>
        </Col>
      </Row>);
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
            onChange={this.handleLanguageSelection}
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
            onChange={this.handleLanguageSelection}
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
                <ListGroup>
                  {options}
                </ListGroup>
                {languageSelection}
              </FormGroup>
              <Button type="submit">Starta</Button>
            </form>
          </Col>
        </Row>
        <Row>
          <br />
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

// <Col xs={2} md={3} lg={4}>
//   <DatePicker
//     selected={this.state.startDate}
//     onChange={this.handleDateChange}
//   />
// </Col>
