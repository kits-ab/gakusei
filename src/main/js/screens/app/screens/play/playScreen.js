import React from 'react';
import { Grid, Col } from 'react-bootstrap';
import ButtonsCard from './components/Cards/ButtonsCard';
import FlashCard from './components/Cards/FlashCard';
import WriteCard from './components/Cards/WriteCard';
import TranslateCard from './components/Cards/TranslateCard';
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

  componentDidMount() {
    // Kick user out if data is missing
    if (!this.props.questions || this.props.questions.length === 0) {
      if (this.props.params.type) {
        this.props.setPageByName(`/select/${this.props.params.type}`);
      } else {
        this.props.setPageByName('/home');
      }
    }
  }

  checkAnswer(answer, cardData) {
    let cloneCard = 'undefined';
    if (typeof cardData !== 'undefined') {
      cloneCard = React.cloneElement(cardData);
    }
    this.props.setAllButtonsDisabledState(true);
    this.props.addUserAnswer(answer, cloneCard)
    .catch(() => {
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
          this.props.setPageByName(`/finish/${this.props.params.type}`);
        }, window.customDelay /* not really accessible, just for e2e testing */ || 1100);
    }
  }

  render() {
    let playCard = null;
    switch (this.props.params.type) {
      case 'translate':
        playCard = (<TranslateCard
          question={this.props.currentQuestion}
          answerType={this.props.answerType}
          questionType={this.props.questionType}
          cardType={this.props.params.type}
          buttonsDisabled={this.props.allButtonsDisabled}
          clickCallback={this.checkAnswer}
          correctAlternative={this.props.currentQuestion.correctAlternative}
          questionAnswered={this.props.currentProcessedQuestionAnswered}
          questionAnsweredCorrectly={this.props.currentProcessedQuestionAnsweredCorrectly}
        />);
        break;
      case 'kanji':
        playCard = (<WriteCard
          question={this.props.currentQuestion}
          answerType={this.props.answerType}
          questionType={this.props.questionType}
          cardType={this.props.params.type}
          buttonsDisabled={this.props.allButtonsDisabled}
          clickCallback={this.checkAnswer}
          correctAlternative={this.props.currentQuestion.correctAlternative}
          questionAnswered={this.props.currentProcessedQuestionAnswered}
          questionAnsweredCorrectly={this.props.currentProcessedQuestionAnsweredCorrectly}
        />);
        break;
      case 'flashcards':
        playCard = (<FlashCard
          question={this.props.currentQuestion}
          answerType={this.props.answerType}
          questionType={this.props.questionType}
          cardType={this.props.params.type}
          buttonsDisabled={this.props.allButtonsDisabled}
          clickCallback={this.checkAnswer}
          correctAlternative={this.props.currentQuestion.correctAlternative}
          questionAnswered={this.props.currentProcessedQuestionAnswered}
          questionAnsweredCorrectly={this.props.currentProcessedQuestionAnsweredCorrectly}
        />);
        break;
      case 'guess':
      case 'quiz':
      default:
        playCard = (<ButtonsCard
          question={this.props.currentQuestion}
          answerType={this.props.answerType}
          questionType={this.props.questionType}
          cardType={this.props.params.type}
          buttonsDisabled={this.props.allButtonsDisabled}
          clickCallback={this.checkAnswer}
          correctAlternative={this.props.currentQuestion.correctAlternative}
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
          <LessonStats
            currentQuestionNumber={this.props.currentQuestionIndex + 1}
            totalQuestionsNumber={this.props.lessonLength}
            correctAttempts={this.props.correctAttempts}
            lessonSuccessRateMessage={this.props.lessonSuccessRateMessage}
            lessonType={this.props.params.type}
            feedbackItems={this.props.answeredQuestions.map((answeredQuestion) => {
                  if (this.props.params.type !== 'kanji') {
                    return ({
                        correct: answeredQuestion.userCorrect,
                        errorCount: answeredQuestion.userCorrect ? 1 : 0,
                        text: ''
                    });
                  }
                  return (
                    {
                        correct: answeredQuestion.userCorrect,
                        errorCount: answeredQuestion.cardData.filter(line => !line.match.userCorrect).length,
                        text: answeredQuestion.cardData[answeredQuestion.cardData.length - 1]
                            .totalMatch.wording
                    }
                  );
                }
            )}
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
