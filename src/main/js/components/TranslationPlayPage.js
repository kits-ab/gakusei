/* global sessionStorage*/

import React from 'react';
import { Button, Grid, Row } from 'react-bootstrap';
import Utility from '../util/Utility';

export default class TranslationPlayPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: '',
      output: '',
      question: [],
      correctAlt: '',
      checkDisable: false,
      results: [],
      lessonLength: JSON.parse(sessionStorage.lesson).length
    };
    this.checkAnswer = this.checkAnswer.bind(this);
    this.handleChange = this.handleChange.bind(this);

    sessionStorage.correctAttempts = 0;
    sessionStorage.totalAttempts = 0;
    sessionStorage.currentQuestionIndex = 0;
  }
  componentDidMount() {
    this.setQuestion(0);
  }
  componentWillUnmount() {
    sessionStorage.removeItem('currentQuestionIndex');
  }
  setQuestion(questionIndex) {
    this.setState({
      answer: '',
      output: '',
      question: JSON.parse(sessionStorage.lesson)[questionIndex].question,
      correctAlt: JSON.parse(sessionStorage.lesson)[questionIndex].correctAlternative,
      checkDisable: false
    }, () => {
      Utility.logEvent('TranslationPlayPage', 'question', this.state.question, this.props.username);
    });
  }
  getNextQuestion() {
    if (Number(sessionStorage.currentQuestionIndex) + 1 < this.state.lessonLength) {
      sessionStorage.currentQuestionIndex = Number(sessionStorage.currentQuestionIndex) + 1;
      this.setQuestion(Number(sessionStorage.currentQuestionIndex));
    } else {
      this.props.switchPage('EndScreenPage', { gamemode: 'TranslationPlayPage' });
    }
  }
  handleChange(event) {
    this.setState({ answer: event.target.value });
  }
  checkAnswer() {
    Utility.logEvent('TranslationPlayPage', 'userAnswer', this.state.answer, this.props.username);
    let answeredCorrectly = false;
    if (this.state.answer.trim().toUpperCase() === this.state.correctAlt.toUpperCase()) {
      answeredCorrectly = true;
      this.setState({ output: 'Rätt!' });
      sessionStorage.correctAttempts = Number(sessionStorage.correctAttempts) + 1;
    } else {
      this.setState({ output: `Fel! Det rätta svaret är: ${this.state.correctAlt}` });
    }
    Utility.logEvent('TranslationPlayPage', 'correctAnswer', this.state.question, this.props.username);
    Utility.logEvent('TranslationPlayPage', 'correctAnswer', this.state.correctAlt, this.props.username);
    Utility.logEvent('TranslationPlayPage', 'answeredCorrectly', answeredCorrectly, this.props.username);
    this.setState({
      checkDisable: true
    });
    sessionStorage.totalAttempts = Number(sessionStorage.totalAttempts) + 1;
    this.setState({
      results: this.state.results.concat([[this.state.question, this.state.correctAlt, this.state.answer]])
    });
    if (Number(sessionStorage.currentQuestionIndex) < this.state.lessonLength - 1) {
      setTimeout(() => {
        this.getNextQuestion();
      }, 2000);
    } else {
      setTimeout(
        () => this.props.switchPage('EndScreenPage', { results: this.state.results, gamemode: 'TranslationPlayPage' }),
        2000
      );
    }
  }
  render() {
    const questionOutput = (this.state.question.length > 1) ?
      <div><h2>Reading: {this.state.question[0]}</h2><h2>Writing: {this.state.question[1]}</h2></div>
      : <h2>{this.state.question[0]}</h2>;
    return (
      <div>
        <Grid className="text-center">
          <Row>
            {questionOutput}
          </Row>
          <br />
          <Row>
            <input value={this.state.answer} onChange={this.handleChange} placeholder="Skriv in ditt svar här" />
          </Row>
          <Row>
            <Button type="submit" onClick={this.checkAnswer} disabled={this.state.checkDisable}>
              Kontrollera svar
            </Button>
          </Row>
          <Row>
            <div className="text-center">
              {`Fråga: ${(Number(sessionStorage.currentQuestionIndex) + 1)} / ${this.state.lessonLength}`}
              <br />
              {`${sessionStorage.correctAttempts} rätt ${Utility.getSuccessRate()}`}
            </div>
          </Row>
          <Row>
            <h3>{this.state.output}</h3>
          </Row>
        </Grid>
      </div>
    );
  }
}

TranslationPlayPage.propTypes = {
  switchPage: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired
};
