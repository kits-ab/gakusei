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
    this.nextQuestion = this.nextQuestion.bind(this);

    this.state = {
      showHint: false
    };
  }

  componentWillMount() {
    // Kick user out if data is missing
    if (!this.props.questions || this.props.questions.length === 0) {
      if (this.props.match.params.type) {
        this.props.setPageByName(`/select/${this.props.match.params.type}`);
      } else {
        this.props.setPageByName('/home');
      }
    }
  }

  updateHintVisibility = () => {
    this.setState({ showHint: !this.state.showHint });
  };

  checkAnswer(answer, cardData) {
    let cloneCard = 'undefined';
    const textInputPlayType = ['grammar', 'translate'].includes(this.props.match.params.type);
    if (cardData.type === undefined && Array.isArray(cardData)) {
      cloneCard = cardData.slice(0);
    } else if (typeof cardData !== 'undefined') {
      cloneCard = React.cloneElement(cardData);
    }

    this.props.setAllButtonsDisabledState(true);
    this.props.addUserAnswer(answer, cloneCard).catch(() => {
      this.props.requestUserLogout('/', getCSRF());
      this.props.verifyUserLoggedIn();
    });

    if (textInputPlayType) {
      this.props.setAnswerTextInputFocusedState(false);
      if (this.props.currentQuestionIndex === this.props.lessonLength - 1) {
        setTimeout(() => {
          this.props.setPageByName(`/finish/${this.props.match.params.type}`);
        }, window.customDelay /* not really accessible, just for e2e testing */ || 2000);
      } else {
        this.props.setAllButtonsDisabledState(false);
      }
    } else if (!textInputPlayType && this.props.currentQuestionIndex < this.props.lessonLength - 1) {
      setTimeout(() => {
        this.props.incrementQuestionIndex();
        this.props.processCurrentQuestion();
        this.props.setAllButtonsDisabledState(false);
      }, window.customDelay /* not really accessible, just for e2e testing */ || 1100);
    } else {
      setTimeout(() => {
        this.props.setPageByName(`/finish/${this.props.match.params.type}`);
      }, window.customDelay /* not really accessible, just for e2e testing */ || 1100);
    }
  }

  nextQuestion() {
    this.props.setAllButtonsDisabledState(true);
    this.setState({ showHint: false });
    if (this.props.currentQuestionIndex < this.props.lessonLength - 1) {
      this.props.incrementQuestionIndex();
      this.props.processCurrentQuestion();
      this.props.setAnswerTextInputFocusedState(true);
      this.props.setAllButtonsDisabledState(false);
    } else {
      this.props.setPageByName(`/finish/${this.props.match.params.type}`);
    }
  }

  render() {
    let playCard = null;
    switch (this.props.match.params.type) {
      case 'grammar':
      case 'translate':
        playCard = (
          <TranslateCard
            question={this.props.currentQuestion}
            answerType={this.props.answerType}
            questionType={this.props.questionType}
            cardType={this.props.match.params.type}
            buttonsDisabled={this.props.allButtonsDisabled}
            clickCallback={this.checkAnswer}
            clickNextCallback={this.nextQuestion}
            inputFocused={this.props.answerTextInputFocused}
            correctAlternative={this.props.currentQuestion.correctAlternative}
            questionAnswered={this.props.currentProcessedQuestionAnswered}
            questionAnsweredCorrectly={this.props.currentProcessedQuestionAnsweredCorrectly}
            updateHintVisibility={this.updateHintVisibility}
            showHint={this.state.showHint}
          />
        );
        break;
      case 'kanji':
        playCard = (
          <WriteCard
            question={this.props.currentQuestion}
            answerType={this.props.answerType}
            questionType={this.props.questionType}
            cardType={this.props.match.params.type}
            buttonsDisabled={this.props.allButtonsDisabled}
            clickCallback={this.checkAnswer}
            correctAlternative={this.props.currentQuestion.correctAlternative}
            questionAnswered={this.props.currentProcessedQuestionAnswered}
            questionAnsweredCorrectly={this.props.currentProcessedQuestionAnsweredCorrectly}
          />
        );
        break;
      case 'flashcards':
        playCard = (
          <FlashCard
            question={this.props.currentQuestion}
            answerType={this.props.answerType}
            questionType={this.props.questionType}
            cardType={this.props.match.params.type}
            buttonsDisabled={this.props.allButtonsDisabled}
            clickCallback={this.checkAnswer}
            correctAlternative={this.props.currentQuestion.correctAlternative}
            questionAnswered={this.props.currentProcessedQuestionAnswered}
            questionAnsweredCorrectly={this.props.currentProcessedQuestionAnsweredCorrectly}
          />
        );
        break;
      case 'guess':
      case 'quiz':
      default:
        playCard = (
          <ButtonsCard
            question={this.props.currentQuestion}
            answerType={this.props.answerType}
            questionType={this.props.questionType}
            cardType={this.props.match.params.type}
            buttonsDisabled={this.props.allButtonsDisabled}
            clickCallback={this.checkAnswer}
            correctAlternative={this.props.currentQuestion.correctAlternative}
            questionAnswered={this.props.currentProcessedQuestionAnswered}
            questionAnsweredCorrectly={this.props.currentProcessedQuestionAnsweredCorrectly}
          />
        );
        break;
    }
    return (
      <Grid className="text-center">
        <Col
          xs={12}
          sm={8}
          smOffset={2}
          md={6}
          mdOffset={3}
        >
          {playCard}
          <br />
          <LessonStats
            currentQuestionNumber={this.props.currentQuestionIndex + 1}
            totalQuestionsNumber={this.props.lessonLength}
            correctAttempts={this.props.correctAttempts}
            lessonSuccessRateMessage={this.props.lessonSuccessRateMessage}
            lessonType={this.props.match.params.type}
            feedbackItems={this.props.answeredQuestions.map(answeredQuestion => {
              if (this.props.match.params.type !== 'kanji') {
                return {
                  correct: answeredQuestion.userCorrect,
                  errorCount: answeredQuestion.userCorrect ? 1 : 0,
                  text: ''
                };
              }
              return {
                correct: answeredQuestion.userCorrect,
                errorCount: answeredQuestion.cardData.filter(line => !line.match.userCorrect).length,
                text: answeredQuestion.cardData[answeredQuestion.cardData.length - 1].totalMatch.wording
              };
            })}
          />
        </Col>
      </Grid>
    );
  }
}

playScreen.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

playScreen.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

export default Utility.superConnect(this, Reducers)(playScreen);
