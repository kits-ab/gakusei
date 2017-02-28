import React from 'react';
import { Button, Grid, Row, Col, FormGroup, FormControl, ControlLabel, ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap';
import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/stores/Lessons';
import * as Security from '../../../../shared/stores/Security';

export const Reducers = [Lessons, Security];

export class selectScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleStarredClick = this.handleStarredClick.bind(this);
  }

  componentWillMount() {
    this.props.fetchLessonNames(this.props.params.type);
    this.props.fetchUserStarredLessons();
  }

  // Triggers when we change between play types but remain in "selection" page
  componentWillReceiveProps(nextProps) {
    if (this.props.params.type !== nextProps.params.type) {
      this.props.fetchLessonNames(this.props.params.type);
    }
  }

  handleChange(event) {
    if (event.target.name === 'questionType') {
      this.props.setQuestionLanguage(event.target.value);
    } else if (event.target.name === 'answerType') {
      this.props.setAnswerLanguage(event.target.value);
    }
  }
  handleSubmit(event) {
    event.preventDefault();

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
  }
  handleStarredClick(lessonName) {
    return this.props.starredLessons.includes(lessonName) ?
      this.props.removeStarredLesson(lessonName) :
      this.props.addStarredLesson(lessonName);
  }
  render() {
    const options = this.props.lessonNames.map(name =>
      <Row key={name}>
        <Col xs={10} md={10}>
          <ListGroupItem
            onClick={() => this.props.setSelectedLesson(name)}
            value={name}
            bsStyle={name === this.props.selectedLesson ? 'info' : null}
          >
            {name}
          </ListGroupItem>
        </Col>
        <Col xs={2} md={2}>
          <Button
            bsStyle={this.props.starredLessons.includes(name) ? 'warning' : null}
            onClick={() => this.handleStarredClick(name)}
          >
            <Glyphicon glyph="star" />
          </Button>
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
      </Grid>
    );
  }
}

selectScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

selectScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);


export default Utility.superConnect(this, Reducers)(selectScreen);
