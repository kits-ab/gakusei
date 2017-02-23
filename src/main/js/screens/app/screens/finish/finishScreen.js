import React from 'react';
import { Button, Grid, Row, ListGroup, ListGroupItem } from 'react-bootstrap';
import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/stores/Lessons';
import * as Security from '../../../../shared/stores/Security';

export const Reducers = [Lessons, Security];

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
    this.props.processedQuestionsWithAnswers.forEach((processedQuestionWithAnswer) => {
      // Send in the correct answers
      processedQuestionWithAnswer.correctAlternative.forEach(correctAlt =>
      Utility.logEvent('finish', 'correctAnswer', correctAlt, this.props.loggedInUser));

      // Send in the user answer
      Utility.logEvent('finish', 'userAnswer', processedQuestionWithAnswer.userAnswer, this.props.loggedInUser);
    });
  }

  backtoSelection() {
    this.props.fetchLesson(this.props.params.type)
    .then(this.props.setPageByName(`/select/${this.props.params.type}`));
  }
  playAgain() {
    if (this.props.params.type === 'translate') {
      this.props.fetchLesson(this.props.params.type)
      .then(this.props.setPageByName(`/translate/${this.props.params.type}`));
    } else {
      this.props.fetchLesson(this.props.params.type)
      .then(this.props.setPageByName(`/play/${this.props.params.type}`));
    }
  }

  showResults() {
    const result = this.props.processedQuestionsWithAnswers.map(qa => (qa.actualQuestionShapes.length > 1 ?
      <ListGroupItem key={qa.userAnswer + qa.correctAlternative[0]} bsStyle={(qa.userAnswer === qa.correctAlternative) ? 'success' : 'danger'}>
        Läsform: {qa.actualQuestionShapes[0]}
        , Skrivform: {qa.actualQuestionShapes[1]}
        , Korrekt svar: {qa.correctAlternative}
        , Ditt svar: {qa.userAnswer}
      </ListGroupItem> :
      <ListGroupItem key={qa.userAnswer + qa.correctAlternative[0]} bsStyle={(qa.userAnswer === qa.correctAlternative) ? 'success' : 'danger'}>
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

finishScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

finishScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);

export default Utility.superConnect(this, Reducers)(finishScreen);
