/* global fetch window sessionStorage */

import React from 'react';
import { connect } from 'react-redux';
import { ButtonToolbar, Grid, Row, Col } from 'react-bootstrap';
import AnswerButton from './AnswerButton';
import Utility from '../util/Utility';
import * as SecurityStore from '../store/Security';
import * as UserStatisticsStore from '../store/UserStatistics';

export class FourAlternativeQuestion extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   question: [],
    //   correctAlt: '',
    //   randomizedAlternatives: ['', '', '', ''],
    //   buttonStyles: ['default', 'default', 'default', 'default'],
    //   buttonDisabled: false,
    //   results: [],
    //   lessonLength: this.props.questions.length
    // };
    this.checkAnswer = this.checkAnswer.bind(this);
    this.onKeys = this.onKeys.bind(this);

    this.props.resetLesson();
  }
  componentDidMount() {
    window.addEventListener('keydown', this.onKeys);
    this.setQuestion(0);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeys);
    this.props.resetLesson();
  }
  onKeys(event) {
    const keyDown = event.key;
    if (!this.props.allButtonsDisabled) {
      if (keyDown === '1') {
        this.checkAnswer(this.props.processedQuestion.randomizedAlternatives[0]);
      } else if (keyDown === '2') {
        this.checkAnswer(this.props.processedQuestion.randomizedAlternatives[1]);
      } else if (keyDown === '3') {
        this.checkAnswer(this.props.processedQuestion.randomizedAlternatives[2]);
      } else if (keyDown === '4') {
        this.checkAnswer(this.props.processedQuestion.randomizedAlternatives[3]);
      }
    }
  }

  checkAnswer(answer) {
    Utility.logEvent(this.props.currentPageName, 'userAnswer', answer, this.props.loggedInUser);

    if (answer === this.props.processedQuestion.correctAlternative) {
      this.props.receiveCorrectAttempt();
    } else {
      this.props.receiveIncorrectAttempt();
    }

    this.props.addUserAnswer(answer);
    this.props.calcAnswerButtonStyles(answer);

    // Utility.logEvent(this.props.currentPageName, 'correctAnswer', this.state.question, this.props.loggedInUser);
    // Utility.logEvent(this.props.currentPageName, 'correctAnswer', this.state.correctAlt, this.props.loggedInUser);
    // Utility.logEvent(this.props.currentPageName, 'answeredCorrectly', answeredCorrectly, this.props.loggedInUser);
    if (this.props.currentQuestionIndex < this.props.lessonLength - 1) {
      setTimeout(() => {
        this.props.calcNextQuestion();
      }, 1000);
    } else {
      setTimeout(
        () => {
          this.props.setPageByName('EndScreenPage');
        }, 1000);
    }
  }
  displayQuestion(pageName) {
    const questionText = {
      GuessPlayPage: (
        <div>
          <h2>Läsform: {this.props.processedQuestion.question[0]}</h2>
          {(this.props.processedQuestion.length > 1) ? <h2>Skrivform: {this.props.processedQuestion[1]} </h2> : ' '}
        </div>
      ),
      QuizPlayPage: <h2>{this.props.processedQuestion[0]}</h2>
    };
    let resource;
    if (this.props.resourceRef && this.state.resourceRef.type === 'kanjidrawing') {
      resource = <object height="50em" type="image/svg+xml" data={this.state.resourceRef.location}>SVG error</object>;
    }
    return resource ? <div>{resource}<br />{questionText[pageName]}</div> : questionText[pageName];
  }
  render() {
    return (
      <div>
        <Grid className="text-center">
          <Row>
            {this.displayQuestion(this.props.currentPageName)}
          </Row>
          <br />
          <Row>
            <ButtonToolbar>
              <Col xs={6} sm={4} smOffset={2} md={3} mdOffset={3}>
                <AnswerButton
                  label={this.props.processedQuestion.randomizedAlternatives[0]}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.props.processedQuestion.buttonStyles[0]}
                  disableButton={this.props.processedQuestion.buttonDisabled}
                />
              </Col>
              <Col xs={6} sm={4} md={3}>
                <AnswerButton
                  label={this.props.processedQuestion.randomizedAlternatives[1]}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.props.processedQuestion.buttonStyles[1]}
                  disableButton={this.props.processedQuestion.buttonDisabled}
                />
              </Col>
            </ButtonToolbar>
          </Row>
          <br />
          <Row>
            <ButtonToolbar>
              <Col xs={6} sm={4} smOffset={2} md={3} mdOffset={3}>
                <AnswerButton
                  label={this.props.processedQuestion.randomizedAlternatives[2]}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.props.processedQuestion.buttonStyles[2]}
                  disableButton={this.props.processedQuestion.buttonDisabled}
                />
              </Col>
              <Col xs={6} sm={4} md={3}>
                <AnswerButton
                  label={this.props.processedQuestion.randomizedAlternatives[3]}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.props.processedQuestion.buttonStyles[3]}
                  disableButton={this.props.processedQuestion.buttonDisabled}
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

FourAlternativeQuestion.propTypes = {
  // username: React.PropTypes.string.isRequired,
  // switchPage: React.PropTypes.func.isRequired,
  // pageName: React.PropTypes.string.isRequired,
  // redux props
  successRate: React.PropTypes.number.isRequired,
  lessonSuccessRate: React.PropTypes.number.isRequired,
  lessonSuccessRateMessage: React.PropTypes.string.isRequired,
  requestingSuccessRate: React.PropTypes.bool.isRequired,
  requestSuccessRateStatus: React.PropTypes.string.isRequired,
  requestSuccessRateResponse: React.PropTypes.string.isRequired,
  requestSuccessRateLastReceived: React.PropTypes.date.isRequired,

  currentPageName: React.PropTypes.string.isRequired,
  currentPage: React.PropTypes.string.isRequired,
  pages: React.PropTypes.object.isRequired,

  gamemode: React.PropTypes.string.isRequired,

  lessonNames: React.PropTypes.array.isRequired,
  fetchURL: React.PropTypes.string.isRequired,

  selectedLesson: React.PropTypes.string.isRequired,

  // FourAlternativeQuestion.js
  questions: React.PropTypes.arrayOf({
    question: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
    alternative1: React.PropTypes.string.isRequired,
    alternative2: React.PropTypes.string.isRequired,
    alternative3: React.PropTypes.string.isRequired,
    correctAlternative: React.PropTypes.string.isRequired
  }).isRequired,

  processedQuestion: React.PropTypes.React.PropTypes.objectOf({
    actualQuestionShapes: React.PropTypes.array.isRequired,
    correctAlternative: React.PropTypes.string.isRequired,
    randomizedAlternatives: React.PropTypes.array.isRequired,
    buttonStyles: React.PropTypes.array.isRequired,
    buttonDisabled: React.PropTypes.bool.isRequired,
    resourceRef: React.PropTypes.string.isRequired }).isRequired,
  resourceRef: React.PropTypes.string.isRequired,
  allButtonsDisabled: React.PropTypes.bool.isRequired,
  userAnswers: React.PropTypes.arrayOf(
    React.PropTypes.string.isRequired, // question
    React.PropTypes.string.isRequired, // correctAlternative
    React.PropTypes.string.isRequired, // answer
  ).isRequired,
  lessonLength: React.PropTypes.number.isRequired,
  correctAttempts: React.PropTypes.number.isRequired,
  totalAttempts: React.PropTypes.number.isRequired,
  currentQuestionIndex: React.PropTypes.number.isRequired,
  loggedInUser: React.PropTypes.string.isRequired,
  // redux action creators
  // fetchLoggedInUser: React.PropTypes.func.isRequired,
  // loggedIn: React.PropTypes.bool.isRequired,
  requestUserSuccessRate: React.PropTypes.func.isRequired,
  fetchUserSuccessRate: React.PropTypes.func.isRequired,
  receiveUserSuccessRate: React.PropTypes.func.isRequired,
  receiveCorrectAttempt: React.PropTypes.func.isRequired,
  receiveIncorrectAttempt: React.PropTypes.func.isRequired,
  calcLessonSuccessRate: React.PropTypes.func.isRequired,
  // incrementQuestionIndex,
  resetQuestionIndex: React.PropTypes.func.isRequired,
  fetchLesson: React.PropTypes.func.isRequired,
  setSelectedLesson: React.PropTypes.func.isRequired,
  setGameMode: React.PropTypes.func.isRequired,
  setPageByName: React.PropTypes.func.isRequired,
  calcNextQuestion: React.PropTypes.func.isRequired,
  setAllButtonsDisabledState: React.PropTypes.func.isRequired,
  addUserAnswer: React.PropTypes.func.isRequired,
  clearUserAnswers: React.PropTypes.func.isRequired,
  resetAttempts: React.PropTypes.func.isRequired,
  calcAnswerButtonStyles: React.PropTypes.func.isRequired,
  resetLesson: React.PropTypes.func.isRequired
};

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    // Selects which state properties are merged into the component's props
    state => ({ ...state.userStatistics, ...state.security }),
    // Selects which action creators are merged into the component's props
    { ...UserStatisticsStore.actionCreators, ...SecurityStore.actionCreators }
)(FourAlternativeQuestion);
