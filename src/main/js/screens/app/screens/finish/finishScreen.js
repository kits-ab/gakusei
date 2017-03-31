import React from 'react';
import { Button, Grid, Row, ListGroup, ListGroupItem, Col } from 'react-bootstrap';
import Utility from '../../../../shared/util/Utility';
import getCSRF from '../../../../shared/util/getcsrf';
import DisplayQuestion from '../../shared/DisplayQuestion';
import * as Lessons from '../../../../shared/reducers/Lessons';
import * as Security from '../../../../shared/reducers/Security';

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
      try {
        // Send in the correct answers
        processedQuestionWithAnswer.correctAlternative.forEach(correctAlt =>
          Utility.logEvent('finish', 'correctAnswer', correctAlt, null, this.props.loggedInUser));
        // Send in the user answer
        Utility.logEvent('finish', 'userAnswer', processedQuestionWithAnswer.userAnswer, null, this.props.loggedInUser);
      } catch (err) {
        this.props.requestUserLogout(this.props.location.query.currentUrl || '/', getCSRF());
      }
    });
  }

  backtoSelection() {
    this.props.fetchLesson(this.props.params.type)
      .catch(this.props.verifyUserLoggedIn())
      .then(this.props.setPageByName(`/select/${this.props.params.type}`));
  }
  playAgain() {
    this.props.fetchLesson(this.props.params.type)
      .catch(this.props.verifyUserLoggedIn())
      .then(this.props.setPageByName(`/play/${this.props.params.type}`));
  }

  showResults() {
    const result = this.props.processedQuestionsWithAnswers.map(qa =>
      <ListGroupItem
        key={qa.userAnswer + qa.correctAlternative[0]}
        bsStyle={qa.correctAlternative.indexOf(qa.userAnswer) !== -1 ? 'success' : 'danger'}
      >
        <DisplayQuestion
          primaryText={qa.actualQuestionShapes[0]}
          secondaryText={qa.actualQuestionShapes[1] || null}
          resourceRef={qa.resourceRef}
          japaneseCharacters={qa.questionType === 'reading'}
          showSpeechButton={this.props.params.type !== 'quiz'}
          smallerText
        />
        Svar: {qa.correctAlternative}. {qa.userAnswer === '' ? '' : `(Du svarade: ${qa.userAnswer})`}
      </ListGroupItem>
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
        <Row>
          <Col xs={12} md={8} mdOffset={2}>
            <ListGroup>
              <ListGroupItem>
                {this.showResults()}
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8} mdOffset={2}>
            <div className="text-center">
              <Button bsStyle="info" className="tryAgainButton" onClick={this.playAgain}>Försök igen</Button>
              {' '}
              <Button
                bsStyle="info"
                className="backToSelectScreenButton"
                onClick={this.backtoSelection}
              >
              Välj nya frågor
            </Button>
            </div>
          </Col>
        </Row>
        <br />
      </Grid>
    );
  }
}

finishScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

finishScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);

export default Utility.superConnect(this, Reducers)(finishScreen);
