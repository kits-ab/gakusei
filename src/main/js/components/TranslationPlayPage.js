/* global sessionStorage*/

import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Row } from 'react-bootstrap';
import Utility from '../util/Utility';
import * as Store from '../Store';

export class TranslationPlayPage extends React.Component {
  constructor(props) {
    super(props);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.displayQuestion = this.displayQuestion.bind(this);

    // sessionStorage.correctAttempts = 0;
    // sessionStorage.totalAttempts = 0;
    // sessionStorage.currentQuestionIndex = 0;
  }
  componentWillMount() {
    this.props.resetLesson();
    this.setState({ answer: '' });
  }

  // setQuestion(questionIndex) {
  //   this.setState({
  //     answer: '',
  //     output: '',
  //     question: JSON.parse(sessionStorage.lesson)[questionIndex].question,
  //     correctAlt: JSON.parse(sessionStorage.lesson)[questionIndex].correctAlternative,
  //     checkDisable: false
  //   }, () => {
  //     Utility.logEvent('TranslationPlayPage', 'question', this.state.question, this.props.loggedInUser);
  //   });
  // }
  // getNextQuestion() {
  //   if (Number(sessionStorage.currentQuestionIndex) + 1 < this.state.lessonLength) {
  //     sessionStorage.currentQuestionIndex = Number(sessionStorage.currentQuestionIndex) + 1;
  //     this.setQuestion(Number(sessionStorage.currentQuestionIndex));
  //   } else {
  //     this.props.setPageByName('EndScreenPage', { gamemode: 'TranslationPlayPage' });
  //   }
  // }

  handleChange(event) {
    this.setState({ answer: event.target.value });
  }

  checkAnswer() {
    this.props.addUserAnswer(this.state.answer);

    if (this.props.currentQuestionIndex < this.props.lessonLength - 1) {
      setTimeout(() => {
        this.setState({ answer: '' });
        this.props.calcNextQuestion();
      }, 1000);
    } else {
      setTimeout(
        () => {
          this.props.setPageByName('finish', this.props.location.query);
        }, 1000);
    }
  }

  getOutput() {
    if (this.props.currentProcessedQuestionAnswered) {
      return (<Row>
        { (this.props.currentProcessedQuestionAnsweredCorrectly ?
          <h3>Rätt!</h3> : <h3>Fel..</h3>) }
      </Row>);
    }
    return '';
  }

  checkAnswerOld() {
    Utility.logEvent('TranslationPlayPage', 'userAnswer', this.state.answer, this.props.loggedInUser);
    let answeredCorrectly = false;
    if (this.state.answer.trim().toUpperCase() === this.state.correctAlt[0].toUpperCase()) {
      answeredCorrectly = true;
      this.setState({ output: 'Rätt!' });
      sessionStorage.correctAttempts = Number(sessionStorage.correctAttempts) + 1;
    } else {
      this.setState({ output: `Fel! Det rätta svaret är: ${this.state.correctAlt}` });
    }
    Utility.logEvent('TranslationPlayPage', 'correctAnswer', this.state.question, this.props.loggedInUser);
    Utility.logEvent('TranslationPlayPage', 'correctAnswer', this.state.correctAlt, this.props.loggedInUser);
    Utility.logEvent('TranslationPlayPage', 'answeredCorrectly', answeredCorrectly, this.props.loggedInUser);
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
        () => this.props.setPageByName('EndScreenPage', { results: this.state.results, gamemode: 'TranslationPlayPage' }),
        2000
      );
    }
  }

  displayQuestion() {
    const questionText = {
      translate: (
        <div>
          <h2>Läsform: {this.props.processedQuestion.actualQuestionShapes[0]}</h2>
          {(this.props.processedQuestion.length > 1) ? <h2>Skrivform: {this.props.processedQuestion.actualQuestionShapes[1]} </h2> : ' '}
        </div>
      )
    };
    let resource;
    if (this.props.resourceRef && this.props.resourceRef.type === 'kanjidrawing') {
      resource = <object height="50em" type="image/svg+xml" data={this.props.resourceRef.location}>SVG error</object>;
    }
    return resource ? <div>{resource}<br />{questionText.translate}</div> : questionText.translate;
  }

  render() {
    return (
      <div>
        <Grid className="text-center">
          <Row>
            {this.displayQuestion()}
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
              Fråga: {this.props.currentQuestionIndex + 1} / {this.props.lessonLength}
              <br />
              {this.props.correctAttempts} rätt {this.props.lessonSuccessRateMessage}
            </div>
          </Row>
          { this.getOutput() }
        </Grid>
      </div>
    );
  }
}

TranslationPlayPage.propTypes = {
  // username: React.PropTypes.string.isRequired,
  // used action creators
  // fetchLoggedInUser: React.PropTypes.func.isRequired,
  // loggedIn: React.PropTypes.bool.isRequired,
  loggedInUser: React.PropTypes.string.isRequired
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
)(TranslationPlayPage);
