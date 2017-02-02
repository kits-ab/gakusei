/* global sessionStorage*/

import React from 'react';
import { Button, Grid, Row, ListGroup, ListGroupItem } from 'react-bootstrap';
import Utility from '../util/Utility';

export default class EndScreenPage extends React.Component {
  componentDidMount() {
    this.logEvents();
  }
  componentWillUnmount() {
    sessionStorage.removeItem('correctAttempts');
    sessionStorage.removeItem('totalAttempts');
  }
  logEvents() {
    for (let i = 0; i < this.props.results.length; i += 1) {
      Utility.logEvent('EndScreenPage', 'correctAnswerQuestionType', this.props.results[i][0], this.props.username);
      Utility.logEvent('EndScreenPage', 'correctAnswer', this.props.results[i][1], this.props.username);
      Utility.logEvent('EndScreenPage', 'userAnswer', this.props.results[i][2], this.props.username);
    }
  }
  render() {
    const successRate = ((Number(sessionStorage.correctAttempts) / Number(sessionStorage.totalAttempts)) * 100);
    const results = this.props.results.map(result => ((result[0].length > 1) ?
      <ListGroupItem key={result[0] + result[1]} bsStyle={(result[1] === result[2]) ? 'success' : 'danger'}>
        Reading: {result[0][0]}, Writing: {result[0][1]}, Korrekt svar: {result[1]}, Ditt svar: {result[2]}
      </ListGroupItem> :
      <ListGroupItem key={result[0] + result[1]} bsStyle={(result[1] === result[2]) ? 'success' : 'danger'}>
        Reading: {result[0][0]}, Korrekt svar: {result[1]}, Ditt svar: {result[2]}
      </ListGroupItem>)
    );
    return (
      <Grid>
        <Row>
          <div className="text-center">
            <h2>
              {successRate.toFixed(0)}% rätt!
            </h2>
            <h3>
              Du svarade rätt på {sessionStorage.correctAttempts} av {sessionStorage.totalAttempts} möjliga frågor
            </h3>
          </div>
        </Row>
        <ListGroup>
          <ListGroupItem>
            {results}
          </ListGroupItem>
        </ListGroup>
        <Row>
          <div className="text-center">
            <Button bsStyle="info" onClick={() => this.props.switchPage(this.props.gamemode)}>Försök igen</Button>
            {' '}
            <Button
              bsStyle="info"
              onClick={() => this.props.switchPage('LessonSelection', { gamemode: this.props.gamemode })}
            >
              Välj nya frågor
            </Button>
          </div>
        </Row>
      </Grid>
    );
  }
}

EndScreenPage.propTypes = {
  username: React.PropTypes.string.isRequired,
  gamemode: React.PropTypes.string.isRequired,
  switchPage: React.PropTypes.func.isRequired,
  results: React.PropTypes.arrayOf(React.PropTypes.array)
};

EndScreenPage.defaultProps = {
  results: [],
  gamemode: ''
};
