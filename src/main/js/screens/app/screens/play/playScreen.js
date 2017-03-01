import React from 'react';
import { ButtonToolbar, Grid, Row, Col } from 'react-bootstrap';
import AnswerButton from './components/AnswerButton';
import DisplayQuestion from '../../shared/DisplayQuestion';

import getCSRF from '../../../../shared/util/getcsrf';
import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/stores/Lessons';
import * as Security from '../../../../shared/stores/Security';

export const Reducers = [Lessons, Security];

export class playScreen extends React.Component {
  constructor(props) {
    super(props);

    this.checkAnswer = this.checkAnswer.bind(this);
    this.onKeys = this.onKeys.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeys);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeys);
  }
  onKeys(event) {
    const keyDown = event.key;
    if (!this.props.allButtonsDisabled) {
      if (keyDown === '1') {
        this.checkAnswer(this.props.processedQuestion.randomizedAlternatives[0][0]);
      } else if (keyDown === '2') {
        this.checkAnswer(this.props.processedQuestion.randomizedAlternatives[1][0]);
      } else if (keyDown === '3') {
        this.checkAnswer(this.props.processedQuestion.randomizedAlternatives[2][0]);
      } else if (keyDown === '4') {
        this.checkAnswer(this.props.processedQuestion.randomizedAlternatives[3][0]);
      }
    }
  }

  checkAnswer(answer) {
    this.props.setAllButtonsDisabledState(true);

    this.props.addUserAnswer(answer).then(() => {
      this.props.calcAnswerButtonStyles(answer);
      if (this.props.currentQuestionIndex < this.props.lessonLength - 1) {
        setTimeout(() => {
          this.props.incrementQuestionIndex();
          this.props.processCurrentQuestion();
          this.props.setAllButtonsDisabledState(false);
        }, 1100);
      } else {
        setTimeout(
        () => {
          this.props.setPageByName(`finish/${this.props.params.type}`);
        }, 1100);
      }
    }, () => {
      // rejection
      this.props.requestUserLogout('/', getCSRF());
      this.props.verifyUserLoggedIn();
    });
  }

  render() {
    return (
      <div>
        <Grid className="text-center">
          <DisplayQuestion
            primaryText={this.props.processedQuestion.actualQuestionShapes[0]}
            secondaryText={this.props.processedQuestion.actualQuestionShapes[1] || null}
            resourceRef={this.props.processedQuestion.resourceRef}
            japaneseCharacters={this.props.questionType === 'reading'}
          />
          <Row>
            <ButtonToolbar>
              <Col xs={6} sm={4} smOffset={2} md={3} mdOffset={3}>
                <AnswerButton
                  primaryText={this.props.processedQuestion.randomizedAlternatives[0][0]}
                  secondaryText={this.props.processedQuestion.randomizedAlternatives[0][1] || null}
                  japaneseCharacters={this.props.questionType === 'reading'}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.props.processedQuestion.buttonStyles[0]}
                  disableButton={this.props.processedQuestion.buttonDisabled || this.props.allButtonsDisabled}
                  answerType={this.props.answerType}
                />
              </Col>
              <Col xs={6} sm={4} md={3}>
                <AnswerButton
                  primaryText={this.props.processedQuestion.randomizedAlternatives[1][0]}
                  secondaryText={this.props.processedQuestion.randomizedAlternatives[1][1] || null}
                  japaneseCharacters={this.props.questionType === 'reading'}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.props.processedQuestion.buttonStyles[1]}
                  disableButton={this.props.processedQuestion.buttonDisabled || this.props.allButtonsDisabled}
                  answerType={this.props.answerType}
                />
              </Col>
            </ButtonToolbar>
          </Row>
          <br />
          <Row>
            <ButtonToolbar>
              <Col xs={6} sm={4} smOffset={2} md={3} mdOffset={3}>
                <AnswerButton
                  primaryText={this.props.processedQuestion.randomizedAlternatives[2][0]}
                  secondaryText={this.props.processedQuestion.randomizedAlternatives[2][1] || null}
                  japaneseCharacters={this.props.questionType === 'reading'}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.props.processedQuestion.buttonStyles[2]}
                  disableButton={this.props.processedQuestion.buttonDisabled || this.props.allButtonsDisabled}
                  answerType={this.props.answerType}
                />
              </Col>
              <Col xs={6} sm={4} md={3}>
                <AnswerButton
                  primaryText={this.props.processedQuestion.randomizedAlternatives[3][0]}
                  secondaryText={this.props.processedQuestion.randomizedAlternatives[3][1] || null}
                  japaneseCharacters={this.props.questionType === 'reading'}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.props.processedQuestion.buttonStyles[3]}
                  disableButton={this.props.processedQuestion.buttonDisabled || this.props.allButtonsDisabled}
                  answerType={this.props.answerType}
                />
              </Col>
            </ButtonToolbar>
          </Row>
          <br />
          <br />
          <Row>
            <div>
              <p>
                Fråga: {this.props.currentQuestionIndex + 1} / {this.props.lessonLength}
              </p>
              <p>
                {this.props.correctAttempts} rätt {this.props.lessonSuccessRateMessage}
              </p>
            </div>
          </Row>
        </Grid>
      </div>
    );
  }
}

playScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

playScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);


export default Utility.superConnect(this, Reducers)(playScreen);
