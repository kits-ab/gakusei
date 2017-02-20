/* global fetch sessionStorage*/

import React from 'react';
import 'whatwg-fetch';
import odiff from 'odiff';
import { Button, Grid, Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as Lessons from '../../../../shared/stores/Lessons';

export class GenericSelection extends React.Component {
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
    // this.calcLessonNames(this.props.location.query.type);
    this.props.fetchLessonNames(this.props.params.type);
  }

  // Triggers when we change between play types but remain in "selection" page
  componentWillReceiveProps(nextProps) {
    if (this.props.params.type !== nextProps.params.type) {
      // this.calcLessonNames(nextProps.params.type);
      this.props.fetchLessonNames(this.props.params.type);
    }
  }

  // calcLessonNames(lessonType) {
  //   let lessons = [];
  //   if (lessonType === 'guess' || lessonType === 'translate') {
  //     lessons = ['JLPT N3', 'JLPT N4', 'JLPT N5', 'GENKI 1', 'GENKI 13', 'GENKI 15'];
  //   } else if (lessonType === 'quiz') {
  //     lessons = ['Den japanska floran'];
  //   }
  //   this.props.setLessonNames(lessons);
  // }

  shouldComponentUpdate(nextProps, nextState) {
    const diffs = odiff(this.props, nextProps);
    return true;
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  handleSubmit(event) {
    event.preventDefault();

    if (this.props.params.type === 'translate') {
      this.props.fetchLesson(this.props.params.type, () => { this.props.setPageByName('/translate'); });
    } else {
      this.props.fetchLesson(this.props.params.type, () => { this.props.setPageByName(`/play/${this.props.params.type}`); });
    }
  }
  render() {
    const title = {
      GuessPlayPage: 'Gissa ordet',
      TranslationPlayPage: 'Översätt ordet',
      QuizPlayPage: 'Quiz'
    };
    const options = this.props.lessonNames.map(name => <option key={name} value={name}>{name}</option>);
    let languageSelection;
    if (this.props.gamemode === 'QuizPlayPage') {
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
            value={this.state.questionType}
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
            value={this.state.answerType}
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
                <FormControl
                  componentClass="select"
                  name="selectedLesson"
                  id="lessonSelection"
                  onChange={this.handleChange}
                  value={this.props.selectedLesson || ''}
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

GenericSelection.propTypes = {
  // gamemode: React.PropTypes.string.isRequired,
  // switchPage: React.PropTypes.func.isRequired,
  location: React.PropTypes.shape({
    query: React.PropTypes.shape({
      type: React.PropTypes.string
    })
  }).isRequired,
  lessonNames: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  // fetchURL: React.PropTypes.string.isRequired,
  selectedLesson: React.PropTypes.string.isRequired,
  // Action creators
  setPageByName: React.PropTypes.func.isRequired
};

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    // Selects which state properties are merged into the component's props
    state => (state.lessons),
    // Selects which action creators are merged into the component's props
    Lessons.actionCreators
)(GenericSelection);
