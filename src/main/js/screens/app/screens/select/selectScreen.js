import React from 'react';
import { Button, Grid, Row, Col, FormGroup, FormControl, ControlLabel, ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap';
import Utility from '../../../../shared/util/Utility';
import devOnly from '../../../../shared/util/devOnly';

import * as Lessons from '../../../../shared/reducers/Lessons';
import * as Security from '../../../../shared/reducers/Security';

export const Reducers = [Lessons, Security];

export class selectScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLanguageSelection = this.handleLanguageSelection.bind(this);
    this.handleStarredClick = this.handleStarredClick.bind(this);

    this.onKeys = this.onKeys.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeys);
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

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeys);
  }

  onKeys(event) {
    if (event.keyCode === 13) {
      this.handleSubmit(event);
    }
  }

  getPageHeader() {
    switch (this.props.params.type) {
      case 'quiz':
        return <h1>Quiz</h1>;
      case 'guess':
        return <h1>Gissa ordet</h1>;
      case 'translate':
        return <h1>Översätt ordet</h1>;
      case 'flashcards':
        return <h1>Bildkort</h1>;
      default:
        throw new Error('No play type specified');
    }
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
      this.props.fetchLesson(this.props.params.type)
          .then(() => {
            this.props.setPageByName(`/play/${this.props.params.type}`);
          });
    } catch (err) {
      this.props.verifyUserLoggedIn();
    }
  }

  handleStarredClick(lesson) {
    return this.props.starredLessons.map(userLesson => userLesson.lesson.name).includes(lesson.name) ?
      this.props.removeStarredLesson(lesson.name) :
      this.props.addStarredLesson(lesson.name);
  }
  render() {
    const options = this.props.lessons.map(lesson =>
      <Row key={lesson.name}>
        <Col xs={2} md={1} lg={2}>
          <Button
            bsStyle={this.props.starredLessons.map(userLesson => userLesson.lesson.name).includes(lesson.name) ? 'warning' : null}
            onClick={() => this.handleStarredClick(lesson)}
          >
            <Glyphicon glyph="star" />
          </Button>
        </Col>
        <Col xs={10} md={11} lg={10}>
          <ListGroupItem
            key={lesson.name}
            onClick={() => this.props.setSelectedLesson(lesson)}
            value={lesson.name}
            header={lesson.name}
            bsStyle={lesson.name === this.props.selectedLesson.name ? 'info' : null}
          />
        </Col>
      </Row>);

    const languages = [];
    languages.push(
      <option key={'reading'} value={'reading'}>Japanska</option>,
      <option key={'swedish'} value={'swedish'}>Svenska</option>
    );

    devOnly(this, () => languages.push(<option key={'english'} value={'english'}>Engelska</option>));

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
            {languages}
          </FormControl>
          <ControlLabel>Välj svarspråk</ControlLabel>
          <FormControl
            componentClass="select"
            name="answerType"
            id="answerLanguageSelection"
            onChange={this.handleLanguageSelection}
            value={this.props.answerType}
          >
            {languages}
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
              <FormControl
                type="hidden"
                onKeyPress={this.handleKeyPress}
              />
              <Button type="submit" bsStyle="primary">&nbsp;Starta&nbsp;</Button>
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
