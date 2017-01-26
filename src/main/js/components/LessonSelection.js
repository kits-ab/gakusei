/* global fetch sessionStorage*/

import React from 'react';
import { Button, Grid, Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default class LessonSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLesson: 'JLPT N3'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  fetchLesson() {
    fetch(`/api/questions?lessonName=${this.state.selectedLesson}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(
        (json) => {
          sessionStorage.lesson = JSON.stringify(json);
          this.props.switchPage(this.props.gamemode);
        })
      .catch(ex => console.log('Fel vid hämtning av spelomgång', ex));
  }
  handleChange(event) {
    if (event.target.id === 'lessonSelection') {
      this.setState({ selectedLesson: event.target.value });
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    this.fetchLesson();
  }
  render() {
    let title = '';
    if (this.props.gamemode === 'GuessPlayPage') {
      title = 'Gissa ordet';
    } else if (this.props.gamemode === 'TranslationPlayPage') {
      title = 'Översätt ordet';
    }
    return (
      <div>
        <Grid>
          <Row>
            <h1 className="text-center">{title}</h1>
          </Row>
          <Row>
            <Col xs={8} lg={3}>
              <form href="#" onSubmit={this.handleSubmit}>
                <FormGroup>
                  <ControlLabel>Välj lista av frågor</ControlLabel>
                  <FormControl
                    componentClass="select"
                    id="lessonSelection"
                    onChange={this.handleChange}
                    value={this.state.selectedLesson}
                  >
                    <option value="JLPT N3">JLPT N3</option>
                    <option value="JLPT N4">JLPT N4</option>
                    <option value="JLPT N5">JLPT N5</option>
                    <option value="GENKI 1">GENKI 1</option>
                    <option value="GENKI 13">GENKI 13</option>
                    <option value="GENKI 15">GENKI 15</option>
                  </FormControl>
                </FormGroup>
                <Button type="submit">Starta</Button>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

LessonSelection.propTypes = {
  gamemode: React.PropTypes.string,
  switchPage: React.PropTypes.func.isRequired
};

LessonSelection.defaultProps = {
  gamemode: ''
};
