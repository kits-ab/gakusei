import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Row, ListGroup, ListGroupItem } from 'react-bootstrap';
import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/stores/Lessons';

export const Reducers = [Lessons];

export class finishScreen extends React.Component {
  constructor(props) {
    super(props);
    this.playAgain = this.playAgain.bind(this);
    this.backtoSelection = this.backtoSelection.bind(this);
    this.showResults = this.showResults.bind(this);
  }

  componentDidMount() {
    this.logEvents();
  }

  logEvents() {
    for (let i = 0; i < this.props.processedQuestionsWithAnswers.length; i += 1) {
      Utility.logEvent('finish', 'correctAnswer', this.props.processedQuestionsWithAnswers[i].correctAlternative, this.props.username);
      Utility.logEvent('finish', 'correctAnswer', this.props.processedQuestionsWithAnswers[i][1], this.props.username);
      Utility.logEvent('finish', 'userAnswer', this.props.processedQuestionsWithAnswers[i][2], this.props.username);
    }
  }

  backtoSelection() {
    this.props.fetchLesson(this.props.params.type)
    .then(this.props.setPageByName(`/select/${this.props.params.type}`));
  }
  playAgain() {
    // this.props.resetLesson();
    if (this.props.params.type === 'translate') {
      this.props.fetchLesson(this.props.params.type)
      .then(this.props.setPageByName(`/translate/${this.props.params.type}`));
    } else {
      this.props.fetchLesson(this.props.params.type)
      .then(this.props.setPageByName(`/play/${this.props.params.type}`));
    }
  }

  showResults() {
    const result = this.props.processedQuestionsWithAnswers.map((qa, index) => (qa.actualQuestionShapes.length > 1 ?
      <ListGroupItem key={index} bsStyle={(qa.userAnswer === qa.correctAlternative) ? 'success' : 'danger'}>
        Läsform: {qa.actualQuestionShapes[0]}
        , Skrivform: {qa.actualQuestionShapes[1]}
        , Korrekt svar: {qa.correctAlternative}
        , Ditt svar: {qa.userAnswer}
      </ListGroupItem> :
      <ListGroupItem key={index} bsStyle={(qa.userAnswer === qa.correctAlternative) ? 'success' : 'danger'}>
        Läsform: {qa.actualQuestionShapes[0]}
        , Korrekt svar: {qa.correctAlternative}
        , Ditt svar: {qa.userAnswer}
      </ListGroupItem>)
    );

    return result;
  }
  render() {
    return (
      <Grid>
        <Row>
          <div className="text-center">
            <h2>
              {this.props.lessonSuccessRate}% rätt!
            </h2>
            <h3>
              Du svarade rätt på {this.props.correctAttempts} av {this.props.totalAttempts} möjliga frågor
            </h3>
          </div>
        </Row>
        <ListGroup>
          <ListGroupItem>
            {this.showResults()}
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

finishScreen.propTypes = {
  results: React.PropTypes.arrayOf(React.PropTypes.array),
  // store props
  processedQuestion: React.PropTypes.shape({
    length: React.PropTypes.number,
    actualQuestionShapes: React.PropTypes.array.isRequired,
    correctAlternative: React.PropTypes.array.isRequired,
    randomizedAlternatives: React.PropTypes.array.isRequired,
    buttonStyles: React.PropTypes.array.isRequired,
    buttonDisabled: React.PropTypes.bool.isRequired,
    resourceRef: React.PropTypes.object }).isRequired,
  lessonSuccessRate: React.PropTypes.number.isRequired,
  loggedInUser: React.PropTypes.string.isRequired,
  // action creators
  // loggedIn: React.PropTypes.bool.isRequired,
  setPageByName: React.PropTypes.func.isRequired
};

finishScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

finishScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);

// Wire up the React component to the Redux store and export it when importing this file
export default Utility.superConnect(this, Reducers)(finishScreen);
