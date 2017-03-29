import React from 'react';
import { Grid, Col } from 'react-bootstrap';
import ButtonsCard from './components/ButtonsCard';
import FlashCard from './components/FlashCard';
import TranslateCard from './components/TranslateCard';
import LessonStats from './components/LessonStats';

import getCSRF from '../../../../shared/util/getcsrf';
import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/reducers/Lessons';
import * as Security from '../../../../shared/reducers/Security';

export const Reducers = [Lessons, Security];

export class playScreen extends React.Component {
  constructor(props) {
    super(props);
    this.checkAnswer = this.checkAnswer.bind(this);
  }

  checkAnswer(answer) {
    this.props.setAllButtonsDisabledState(true);

    this.props.addUserAnswer(answer).catch(() => {
      this.props.requestUserLogout('/', getCSRF());
      this.props.verifyUserLoggedIn();
    });

    if (this.props.currentQuestionIndex < this.props.lessonLength - 1) {
      setTimeout(() => {
        this.props.incrementQuestionIndex();
        this.props.processCurrentQuestion();
        this.props.setAllButtonsDisabledState(false);
      }, window.customDelay /* not really accessible, just for e2e testing */ || 1100);
    } else {
      setTimeout(
        () => {
          this.props.setPageByName(`finish/${this.props.params.type}`);
        }, window.customDelay /* not really accessible, just for e2e testing */ || 1100);
    }
  }

  render() {
    let playCard = null;

    switch (this.props.params.type) {
      case 'translate':
        playCard = (<TranslateCard
          question={this.props.processedQuestion}
          answerType={this.props.answerType}
          questionType={this.props.questionType}
          cardType={this.props.params.type}
          buttonsDisabled={this.props.allButtonsDisabled}
          clickCallback={this.checkAnswer}
          correctAlternative={this.props.processedQuestion.correctAlternative}
          questionAnswered={this.props.currentProcessedQuestionAnswered}
          questionAnsweredCorrectly={this.props.currentProcessedQuestionAnsweredCorrectly}
        />);
        break;
      case 'flashcards':
        playCard = (<FlashCard
          question={this.props.processedQuestion}
          answerType={this.props.answerType}
          questionType={this.props.questionType}
          cardType={this.props.params.type}
          buttonsDisabled={this.props.allButtonsDisabled}
          clickCallback={this.checkAnswer}
          correctAlternative={this.props.processedQuestion.correctAlternative}
          questionAnswered={this.props.currentProcessedQuestionAnswered}
          questionAnsweredCorrectly={this.props.currentProcessedQuestionAnsweredCorrectly}
        />);
        break;
      case 'guess':
      case 'quiz':
      default:
        playCard = (<ButtonsCard
          question={this.props.processedQuestion}
          answerType={this.props.answerType}
          questionType={this.props.questionType}
          cardType={this.props.params.type}
          buttonsDisabled={this.props.allButtonsDisabled}
          clickCallback={this.checkAnswer}
          correctAlternative={this.props.processedQuestion.correctAlternative}
          questionAnswered={this.props.currentProcessedQuestionAnswered}
          questionAnsweredCorrectly={this.props.currentProcessedQuestionAnsweredCorrectly}
        />);
        break;
    }

    return (
      <Grid className="text-center">
        <Col xs={12} sm={8} smOffset={2} md={6} mdOffset={3}>
          {playCard}
          <br />
          <br />
          <LessonStats
            currentQuestionNumber={this.props.currentQuestionIndex + 1}
            totalQuestionsNumber={this.props.lessonLength}
            correctAttempts={this.props.correctAttempts}
            lessonSuccessRateMessage={this.props.lessonSuccessRateMessage}
          />
        </Col>
      </Grid>
    );
  }
}

playScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

playScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);


export default Utility.superConnect(this, Reducers)(playScreen);
