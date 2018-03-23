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
    // Kick user out if data is missing
    if (!this.props.answeredQuestions || this.props.answeredQuestions.length === 0) {
      if (this.props.params.type) {
        this.props.setPageByName(`/select/${this.props.params.type}`);
      } else {
        this.props.setPageByName('/home');
      }
    }

    this.logEvents();
  }

  logEvents() {
    this.props.answeredQuestions.forEach(processedQuestionWithAnswer => {
      try {
        // Send in the correct answers
        processedQuestionWithAnswer.correctAlternative.forEach(correctAlt =>
          Utility.logEvent('finish', 'correctAlternative', correctAlt, null, this.props.loggedInUser)
        );
        // Send in the user answer
        Utility.logEvent('finish', 'userAnswer', processedQuestionWithAnswer.userAnswer, null, this.props.loggedInUser);
      } catch (err) {
        this.props.requestUserLogout(this.props.location.query.currentUrl || '/', getCSRF());
      }
    });
  }

  backtoSelection() {
    this.props
      .fetchLesson(this.props.params.type)
      .catch(this.props.verifyUserLoggedIn())
      .then(this.props.setPageByName(`/select/${this.props.params.type}`));
  }
  playAgain() {
    this.props
      .fetchLesson(this.props.params.type)
      .catch(this.props.verifyUserLoggedIn())
      .then(this.props.setPageByName(`/play/${this.props.params.type}`));
  }

  showResults() {
    const result = this.props.answeredQuestions.map(qa => {
      let yourAnswerText = `Svar: ${qa.correctAlternative}. `;

      if ((qa.userAnswer === null || qa.userAnswer === '') && qa.userCorrect) {
        yourAnswerText += '(Du svarade rätt)';
      } else if ((qa.userAnswer === null || qa.userAnswer === '') && !qa.userCorrect) {
        yourAnswerText += '(Du svarade fel)';
      } else {
        yourAnswerText += `(Du svarade: ${qa.userAnswer})`;
      }

      return (
        <ListGroupItem
          key={qa.userAnswer + qa.correctAlternative[0]}
          bsStyle={qa.userCorrect ? 'success' : 'danger'}
        >
          <DisplayQuestion
            primaryText={qa.shapes[0]}
            secondaryText={qa.shapes[1] || null}
            resourceRef={qa.resourceRef}
            japaneseCharacters={qa.questionType === 'reading'}
            showSpeechButton={this.props.params.type !== 'quiz'}
            smallerText
          />
          {yourAnswerText}
        </ListGroupItem>
      );
    });
    return result;
  }
  render() {
    return (
      <Grid>
        <Row>
          <div className="text-center">
            <h2>{this.props.lessonSuccessRate}% rätt!</h2>
            <h3>
              Du svarade rätt på {this.props.correctAttempts} av {this.props.totalAttempts} möjliga frågor
            </h3>
          </div>
        </Row>
        <Row>
          <Col
            xs={12}
            md={8}
            mdOffset={2}
          >
            <ListGroup>
              <ListGroupItem>{this.showResults()}</ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            md={8}
            mdOffset={2}
          >
            <div className="text-center">
              <Button
                bsStyle="info"
                className="tryAgainButton"
                onClick={this.playAgain}
              >
                Försök igen
              </Button>{' '}
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

finishScreen.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

finishScreen.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

export default Utility.superConnect(this, Reducers)(finishScreen);
