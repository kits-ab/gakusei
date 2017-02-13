/* global sessionStorage*/

import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Row, ListGroup, ListGroupItem } from 'react-bootstrap';
import Utility from '../util/Utility';
import * as Store from '../Store';

export class EndScreenPage extends React.Component {
  constructor(props) {
    super(props);
    this.playAgain = this.playAgain.bind(this);
    this.backtoSelection = this.backtoSelection.bind(this);
  }

  componentDidMount() {
    this.logEvents();
  }
  componentWillUnmount() {
    sessionStorage.removeItem('correctAttempts');
    sessionStorage.removeItem('totalAttempts');
  }
  backtoSelection() {
    // this.props.resetLesson();
    this.props.fetchLesson(() => { this.props.setPageByName('/select', this.props.location.query); });
    // this.props.setPageByName('/select', this.props.location.query);
  }
  playAgain() {
    // this.props.resetLesson();
    this.props.fetchLesson(() => { this.props.setPageByName('/play', this.props.location.query); });
    // this.props.setPageByName('/play', this.props.location.query);
  }
  logEvents() {
    for (let i = 0; i < this.props.results.length; i += 1) {
      Utility.logEvent('EndScreenPage', 'correctAnswer', this.props.results[i][0], this.props.loggedInUser);
      Utility.logEvent('EndScreenPage', 'correctAnswer', this.props.results[i][1], this.props.loggedInUser);
      Utility.logEvent('EndScreenPage', 'userAnswer', this.props.results[i][2], this.props.loggedInUser);
    }
  }
  render() {
    const successRate = ((Number(sessionStorage.correctAttempts) / Number(sessionStorage.totalAttempts)) * 100);
    const results = this.props.results.map(result => ((result[0].length > 1) ?
      <ListGroupItem key={result[0] + result[1]} bsStyle={(result[1] === result[2]) ? 'success' : 'danger'}>
        Läsform: {result[0][0]}, Skrivform: {result[0][1]}, Korrekt svar: {result[1]}, Ditt svar: {result[2]}
      </ListGroupItem> :
      <ListGroupItem key={result[0] + result[1]} bsStyle={(result[1] === result[2]) ? 'success' : 'danger'}>
        Läsform: {result[0][0]}, Korrekt svar: {result[1]}, Ditt svar: {result[2]}
      </ListGroupItem>)
    );
    return (
      <Grid>
        <Row>
          <div className="text-center">
            <h2>
              {this.props.lessonSuccessRate.toFixed(0)}% rätt!
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
            <Button bsStyle="info" onClick={this.playAgain}>Försök igen</Button>
            {' '}
            <Button
              bsStyle="info"
              onClick={this.backtoSelection}
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
  // username: React.PropTypes.string.isRequired,
  gamemode: React.PropTypes.string.isRequired,
  // switchPage: React.PropTypes.func.isRequired,
  results: React.PropTypes.arrayOf(React.PropTypes.array),
  // store props
  lessonSuccessRate: React.PropTypes.number.isRequired,
  loggedInUser: React.PropTypes.string.isRequired,
  // action creators
  // loggedIn: React.PropTypes.bool.isRequired,
  setPageByName: React.PropTypes.func.isRequired
};

EndScreenPage.defaultProps = {
  results: [],
  gamemode: ''
};

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    // Selects which state properties are merged into the component's props
    state => (state.reducer),
    // Selects which action creators are merged into the component's props
    Store.actionCreators
)(EndScreenPage);
