/* global fetch window sessionStorage*/

import React from 'react';
import { ButtonToolbar, Grid, Row, Col } from 'react-bootstrap';
import AnswerButton from './AnswerButton';
import Utility from '../util/Utility';

export default class GuessPlayPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      correctAlt: '',
      randomOrderAlt: ['', '', '', ''],
      buttonStyles: ['default', 'default', 'default', 'default'],
      buttonDisabled: false,
      results: [],
      lessonLength: JSON.parse(sessionStorage.lesson).length
    };
    this.checkAnswer = this.checkAnswer.bind(this);
    this.onKeys = this.onKeys.bind(this);

    sessionStorage.setItem('correctAttempts', 0);
    sessionStorage.totalAttempts = 0;
    sessionStorage.currentQuestionIndex = 0;
  }
  componentDidMount() {
    window.addEventListener('keydown', this.onKeys);
    this.setQuestion(0);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeys);
    sessionStorage.removeItem('currentQuestionIndex');
  }
  onKeys(event) {
    const keyDown = event.key;
    if (!this.state.buttonDisabled) {
      if (keyDown === '1') {
        this.checkAnswer(this.state.randomOrderAlt[0]);
      } else if (keyDown === '2') {
        this.checkAnswer(this.state.randomOrderAlt[1]);
      } else if (keyDown === '3') {
        this.checkAnswer(this.state.randomOrderAlt[2]);
      } else if (keyDown === '4') {
        this.checkAnswer(this.state.randomOrderAlt[3]);
      }
    }
  }
  setQuestion(questionIndex) {
    this.setState({
      question: JSON.parse(sessionStorage.lesson)[questionIndex].question,
      correctAlt: JSON.parse(sessionStorage.lesson)[questionIndex].correctAlternative,
      randomOrderAlt: this.randomizeOrder([
        JSON.parse(sessionStorage.lesson)[questionIndex].alternative1,
        JSON.parse(sessionStorage.lesson)[questionIndex].alternative2,
        JSON.parse(sessionStorage.lesson)[questionIndex].alternative3,
        JSON.parse(sessionStorage.lesson)[questionIndex].correctAlternative]),
      buttonStyles: ['default', 'default', 'default', 'default'],
      buttonDisabled: false
    }, () => {
      Utility.logEvent('GuessPlayPage', 'question', this.state.question, this.props.username);
      for (let i = 0; i < this.state.randomOrderAlt.length; i += 1) {
        Utility.logEvent('GuessPlayPage', 'alternative', this.state.randomOrderAlt[i], this.props.username);
      }
    });
  }
  getNextQuestion() {
    if (Number(sessionStorage.currentQuestionIndex) + 1 < this.state.lessonLength) {
      sessionStorage.currentQuestionIndex = Number(sessionStorage.currentQuestionIndex) + 1;
      this.setQuestion(Number(sessionStorage.currentQuestionIndex));
    } else {
      this.setState({
        buttonDisabled: true
      });
    }
  }
  randomizeOrder(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  checkAnswer(answer) {
    Utility.logEvent('GuessPlayPage', 'userAnswer', answer, this.props.username);
    let newButtonStyles = [];
    if (answer === this.state.correctAlt) {
      newButtonStyles = this.state.randomOrderAlt.map(word => ((word === answer) ? 'success' : 'default'));
      sessionStorage.correctAttempts = Number(sessionStorage.correctAttempts) + 1;
    } else {
      newButtonStyles = this.state.randomOrderAlt.map((word) => {
        if (word === answer) {
          return 'danger';
        } else if (word === this.state.correctAlt) {
          return 'success';
        }
        return 'default';
      });
    }
    sessionStorage.totalAttempts = Number(sessionStorage.totalAttempts) + 1;
    this.setState({
      buttonDisabled: true,
      buttonStyles: newButtonStyles,
      results: this.state.results.concat([[this.state.question, this.state.correctAlt, answer]])
    });
    Utility.logEvent('GuessPlayPage', 'correctAnswer', this.state.question, this.props.username);
    Utility.logEvent('GuessPlayPage', 'correctAnswer', this.state.correctAlt, this.props.username);
    if (Number(sessionStorage.currentQuestionIndex) < this.state.lessonLength - 1) {
      setTimeout(() => {
        this.getNextQuestion();
      }, 1000);
    } else {
      setTimeout(
        () => this.props.switchPage('EndScreenPage', { results: this.state.results, gamemode: 'GuessPlayPage' }), 1000);
    }
  }
  render() {
    const questionOutput = (this.state.question.length > 1) ?
      <div><h2>Reading: {this.state.question[0]}</h2><h2>Writing: {this.state.question[1]}</h2></div> :
      <h2>{this.state.question[0]}</h2>;
    return (
      <div>
        <Grid className="text-center">
          <Row>
            {questionOutput}
          </Row>
          <br />
          <Row>
            <ButtonToolbar>
              <Col xs={6} sm={4} smOffset={2} md={3} mdOffset={3}>
                <AnswerButton
                  label={this.state.randomOrderAlt[0]}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.state.buttonStyles[0]}
                  disableButton={this.state.buttonDisabled}
                />
              </Col>
              <Col xs={6} sm={4} md={3}>
                <AnswerButton
                  label={this.state.randomOrderAlt[1]}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.state.buttonStyles[1]}
                  disableButton={this.state.buttonDisabled}
                />
              </Col>
            </ButtonToolbar>
          </Row>
          <br />
          <Row>
            <ButtonToolbar>
              <Col xs={6} sm={4} smOffset={2} md={3} mdOffset={3}>
                <AnswerButton
                  label={this.state.randomOrderAlt[2]}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.state.buttonStyles[2]}
                  disableButton={this.state.buttonDisabled}
                />
              </Col>
              <Col xs={6} sm={4} md={3}>
                <AnswerButton
                  label={this.state.randomOrderAlt[3]}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.state.buttonStyles[3]}
                  disableButton={this.state.buttonDisabled}
                />
              </Col>
            </ButtonToolbar>
          </Row>
          <br />
          <br />
          <Row>
            <div>
              <p>
                Fråga: {Number(sessionStorage.currentQuestionIndex) + 1} / {this.state.lessonLength}
              </p>
              <p>
                {sessionStorage.correctAttempts} rätt {Utility.getSuccessRate()}
              </p>
            </div>
          </Row>
        </Grid>
      </div>
    );
  }
}

GuessPlayPage.propTypes = {
  username: React.PropTypes.string.isRequired,
  switchPage: React.PropTypes.func.isRequired
};
