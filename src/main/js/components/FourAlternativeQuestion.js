/* global fetch window sessionStorage */

import React from 'react';
import { connect } from 'react-redux';
import { ButtonToolbar, Grid, Row, Col } from 'react-bootstrap';
import AnswerButton from './AnswerButton';
import DisplayQuestion from './DisplayQuestion';
import Utility from '../util/Utility';

import * as Store from '../Store';

export class FourAlternativeQuestion extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   question: [],
    //   correctAlt: ['', ''],
    //   randomOrderAlt: [['', ''], ['', ''], ['', ''], ['', '']],
    //   buttonStyles: ['default', 'default', 'default', 'default'],
    //   buttonDisabled: false,
    //   results: [],
    //   lessonLength: JSON.parse(sessionStorage.lesson).length,
    //   resourceRef: ''
    // };

    this.checkAnswer = this.checkAnswer.bind(this);
    this.onKeys = this.onKeys.bind(this);
    this.displayQuestion = this.displayQuestion.bind(this);
  }

  componentWillMount() {
    this.props.resetLesson();
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
    // Utility.logEvent(this.props.currentPageName, 'userAnswer', answer, this.props.loggedInUser);

    if (answer === this.props.processedQuestion.correctAlternative) {
      this.props.receiveCorrectAttempt();
    } else {
      this.props.receiveIncorrectAttempt();
    }

    this.props.addUserAnswer(answer);
    this.props.calcAnswerButtonStyles(answer);

    if (this.props.currentQuestionIndex < this.props.lessonLength - 1) {
    // let newButtonStyles = [];
    // let answeredCorrectly = false;
    // if (answer === this.state.correctAlt[0]) {
    //   answeredCorrectly = true;
    //   newButtonStyles = this.state.randomOrderAlt.map(word => ((word[0] === answer) ? 'success' : 'default'));
    //   sessionStorage.correctAttempts = Number(sessionStorage.correctAttempts) + 1;
    // } else {
    //   newButtonStyles = this.state.randomOrderAlt.map((word) => {
    //     if (word[0] === answer) {
    //       return 'danger';
    //     } else if (word[0] === this.state.correctAlt[0]) {
    //       return 'success';
    //     }
    //     return 'default';
    //   });
    // }

    // this.setState({
    //   buttonDisabled: true,
    //   buttonStyles: newButtonStyles,
    //   results: this.state.results.concat([[this.state.question, this.state.correctAlt[0], answer]])
    // });
    // Utility.logEvent(this.props.pageName, 'correctAnswer', this.state.question, this.props.username);
    // Utility.logEvent(this.props.pageName, 'correctAnswer', this.state.correctAlt, this.props.username);
    // Utility.logEvent(this.props.pageName, 'answeredCorrectly', answeredCorrectly, this.props.username);
      if (this.props.currentQuestionIndex < this.props.lessonLength - 1) {
        setTimeout(() => {
          this.props.calcNextQuestion();
        }, 1000);
      } else {
        setTimeout(
        () => {
          // this.props.setPageByName('EndScreen');
          this.props.setPageByName('finish', this.props.location.query);
        }, 1000);
      }
    }
  }

  displayQuestion() {
    const questionText = {
      guess: (
        <div>
          <h2>Läsform: {this.props.processedQuestion.actualQuestionShapes[0]}</h2>
          {(this.props.processedQuestion.length > 1) ? <h2>Skrivform: {this.props.processedQuestion.actualQuestionShapes[1]} </h2> : ' '}
        </div>
      ),
      quiz: <h2>{this.props.processedQuestion.actualQuestionShapes[0]}</h2>
    };
    let resource;
    if (this.props.resourceRef && this.props.resourceRef.type === 'kanjidrawing') {
      resource = <object height="50em" type="image/svg+xml" data={this.props.resourceRef.location}>SVG error</object>;
    }
    return resource ? <div>{resource}<br />{questionText[this.props.location.query.type]}</div> : questionText[this.props.location.query.type];
  }

  render() {
    return (
      <div>
        <Grid className="text-center">
          {this.displayQuestion()}
          {/* <DisplayQuestion
            pageName={this.props.pageName}
            question={this.state.question}
            questionType={this.props.questionType}
            resourceRef={this.state.resourceRef}
          />*/}
          <br />
          <Row>
            <ButtonToolbar>
              <Col xs={6} sm={4} smOffset={2} md={3} mdOffset={3}>
                <AnswerButton
                  label={this.props.processedQuestion.randomizedAlternatives[0]}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.props.processedQuestion.buttonStyles[0]}
                  disableButton={this.props.processedQuestion.buttonDisabled}
                  answerType={this.props.answerType}
                />
              </Col>
              <Col xs={6} sm={4} md={3}>
                <AnswerButton
                  label={this.props.processedQuestion.randomizedAlternatives[1]}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.props.processedQuestion.buttonStyles[1]}
                  disableButton={this.props.processedQuestion.buttonDisabled}
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
                  label={this.props.processedQuestion.randomizedAlternatives[2]}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.props.processedQuestion.buttonStyles[2]}
                  disableButton={this.props.processedQuestion.buttonDisabled}
                  answerType={this.props.answerType}
                />
              </Col>
              <Col xs={6} sm={4} md={3}>
                <AnswerButton
                  label={this.props.processedQuestion.randomizedAlternatives[3]}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.props.processedQuestion.buttonStyles[3]}
                  disableButton={this.props.processedQuestion.buttonDisabled}
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

FourAlternativeQuestion.propTypes = {
  // username: React.PropTypes.string.isRequired,
  // switchPage: React.PropTypes.func.isRequired,
  // pageName: React.PropTypes.string.isRequired,
  // redux props
  // successRate: React.PropTypes.number.isRequired,
  // lessonSuccessRate: React.PropTypes.number.isRequired,
  lessonSuccessRateMessage: React.PropTypes.string.isRequired,
  // requestingSuccessRate: React.PropTypes.bool.isRequired,
  // requestSuccessRateStatus: React.PropTypes.string.isRequired,
  // requestSuccessRateResponse: React.PropTypes.string.isRequired,
  // requestSuccessRateLastReceived: React.PropTypes.number.isRequired,

  currentPageName: React.PropTypes.string.isRequired,
  // currentPage: React.PropTypes.string.isRequired,
  // pages: React.PropTypes.object.isRequired,

  // gamemode: React.PropTypes.string.isRequired,

  // lessonNames: React.PropTypes.array.isRequired,
  // fetchURL: React.PropTypes.string.isRequired,

  // selectedLesson: React.PropTypes.string.isRequired,

  // FourAlternativeQuestion.js
  // questions: React.PropTypes.arrayOf({
  //   question: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
  //   alternative1: React.PropTypes.string.isRequired,
  //   alternative2: React.PropTypes.string.isRequired,
  //   alternative3: React.PropTypes.string.isRequired,
  //   correctAlternative: React.PropTypes.string.isRequired
  // }).isRequired,

  processedQuestion: React.PropTypes.shape({
    actualQuestionShapes: React.PropTypes.array.isRequired,
    correctAlternative: React.PropTypes.string.isRequired,
    randomizedAlternatives: React.PropTypes.array.isRequired,
    buttonStyles: React.PropTypes.array.isRequired,
    buttonDisabled: React.PropTypes.bool.isRequired,
    resourceRef: React.PropTypes.object }).isRequired,
  // resourceRef: React.PropTypes.string.isRequired,
  allButtonsDisabled: React.PropTypes.bool.isRequired,
  // userAnswers: React.PropTypes.arrayOf(
  //   React.PropTypes.string.isRequired, // question
  //   React.PropTypes.string.isRequired, // correctAlternative
  //   React.PropTypes.string.isRequired, // answer
  // ).isRequired,
  lessonLength: React.PropTypes.number.isRequired,
  correctAttempts: React.PropTypes.number.isRequired,
  // totalAttempts: React.PropTypes.number.isRequired,
  currentQuestionIndex: React.PropTypes.number.isRequired,
  // loggedInUser: React.PropTypes.string.isRequired,
  // redux action creators
  // fetchLoggedInUser: React.PropTypes.func.isRequired,
  // loggedIn: React.PropTypes.bool.isRequired,
  // requestUserSuccessRate: React.PropTypes.func.isRequired,
  // fetchUserSuccessRate: React.PropTypes.func.isRequired,
  // receiveUserSuccessRate: React.PropTypes.func.isRequired,
  receiveCorrectAttempt: React.PropTypes.func.isRequired,
  receiveIncorrectAttempt: React.PropTypes.func.isRequired,
  // calcLessonSuccessRate: React.PropTypes.func.isRequired,
  // incrementQuestionIndex,
  // resetQuestionIndex: React.PropTypes.func.isRequired,
  // fetchLesson: React.PropTypes.func.isRequired,
  // setSelectedLesson: React.PropTypes.func.isRequired,
  // setGameMode: React.PropTypes.func.isRequired,
  setPageByName: React.PropTypes.func.isRequired,
  calcNextQuestion: React.PropTypes.func.isRequired,
  // setAllButtonsDisabledState: React.PropTypes.func.isRequired,
  addUserAnswer: React.PropTypes.func.isRequired,
  // clearUserAnswers: React.PropTypes.func.isRequired,
  // resetAttempts: React.PropTypes.func.isRequired,
  calcAnswerButtonStyles: React.PropTypes.func.isRequired,
  resetLesson: React.PropTypes.func.isRequired,

  pageName: React.PropTypes.string.isRequired,
  questionType: React.PropTypes.string.isRequired,
  answerType: React.PropTypes.string.isRequired
};


// Selects which state properties are merged into the component's props
function mapStateToProps(state) {
  return Object.assign({},
      state.Main);
}

// Selects which action creators are merged into the component's props
function mapActionCreatorsToProps() {
  return Object.assign({},
      Store.actionCreators);
}

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    mapStateToProps,
    mapActionCreatorsToProps
)(FourAlternativeQuestion);
