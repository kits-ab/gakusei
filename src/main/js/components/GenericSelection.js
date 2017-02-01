/* global fetch sessionStorage*/

import React from 'react';
import 'whatwg-fetch';
import { Button, Grid, Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default class LessonSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLesson: this.props.lessonNames[0]
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  fetchLesson() {
    fetch(`${this.props.fetchURL}?lessonName=${this.state.selectedLesson}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(
        (json) => {
          sessionStorage.lesson = JSON.stringify(json);
          this.props.switchPage(this.props.gamemode);
        })
      .catch(ex => console.log('Fel vid hämtning av spelomgång', ex));
  }
  handleChange(event) {
    this.setState({ selectedLesson: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.fetchLesson();
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
          <h1>{title[this.props.gamemode]}</h1>
        </Row>
        <Row>
          <Col xs={8} xsOffset={2} lg={4} lgOffset={4}>
            <form href="#" onSubmit={this.handleSubmit}>
              <FormGroup>
                <ControlLabel>Välj lista av frågor</ControlLabel>
                <FormControl
                  componentClass="select"
                  id="lessonSelection"
                  onChange={this.handleChange}
                  value={this.state.selectedLesson}
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

LessonSelection.propTypes = {
  gamemode: React.PropTypes.string.isRequired,
  switchPage: React.PropTypes.func.isRequired,
  lessonNames: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  fetchURL: React.PropTypes.string.isRequired
};
