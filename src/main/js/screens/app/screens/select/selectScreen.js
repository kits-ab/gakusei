/* global fetch sessionStorage*/

import React from 'react';
import 'whatwg-fetch';
import odiff from 'odiff';
import { Button, Grid, Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/stores/Lessons';

export const Reducers = [Lessons];

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

  // shouldComponentUpdate(nextProps, nextState) {
  //   const diffs = odiff(this.props, nextProps);
  //   return true;
  // }

  handleChange(event) {
    // this.setState({
    //   [event.target.name]: event.target.value
    // });
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

selectScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

selectScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);

// Wire up the React component to the Redux store and export it when importing this file
export default Utility.superConnect(this, Reducers)(selectScreen);
