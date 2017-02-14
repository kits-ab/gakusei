/* global fetch sessionStorage*/

import React from 'react';
import 'whatwg-fetch';
import { Button, Grid, Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as Store from '../Store';

export class GenericSelection extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // Triggers when we change between play types but remain in "selection" page
  componentWillReceiveProps(nextProps) {
    if (this.props.location.query.type !== nextProps.location.query.type) {
      this.calcLessonNames(nextProps.location.query.type);
    }
  }

  componentWillMount() {
    this.calcLessonNames(this.props.location.query.type);
  }

  calcLessonNames(lessonType) {
    let lessons = [];
    if (lessonType === 'guess' || lessonType === 'translate') {
      lessons = ['JLPT N3', 'JLPT N4', 'JLPT N5', 'GENKI 1', 'GENKI 13', 'GENKI 15'];
    } else if (lessonType === 'quiz') {
      lessons = ['Den japanska floran'];
    }
    this.props.setLessonNames(lessons);
  }

  handleChange(event) {
    this.props.setSelectedLesson(event.target.value);
  }
  handleSubmit(event) {
    event.preventDefault();

    if (this.props.location.query.type === 'translate') {
      this.props.fetchLesson(this.props.location.query.type, () => { this.props.setPageByName('/translate', this.props.location.query); });
    } else {
      this.props.fetchLesson(this.props.location.query.type, () => { this.props.setPageByName('/play', this.props.location.query); });
    }
  }
  render() {
    const title = {
      GuessPlayPage: 'Gissa ordet',
      TranslationPlayPage: 'Översätt ordet',
      QuizPlayPage: 'Quiz'
    };
    const options = this.props.lessonNames.map(name => <option key={name} value={name}>{name}</option>);
    return (
      <Grid className="text-center">
        <Row>
          <Col xs={8} xsOffset={2} lg={4} lgOffset={4}>
            <form href="#" onSubmit={this.handleSubmit}>
              <FormGroup>
                <ControlLabel>Välj lista av frågor</ControlLabel>
                <FormControl
                  componentClass="select"
                  id="lessonSelection"
                  onChange={this.handleChange}
                  value={this.props.selectedLesson || ''}
                >
                  {options}
                </FormControl>
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

export default connect(
    // Selects which state properties are merged into the component's props
    state => (state.reducer),
    // Selects which action creators are merged into the component's props
    Store.actionCreators
)(GenericSelection);
