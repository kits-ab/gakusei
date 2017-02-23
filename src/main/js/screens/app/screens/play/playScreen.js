import React from 'react';
import { ButtonToolbar, Grid, Row, Col } from 'react-bootstrap';
import AnswerButton from './components/AnswerButton';
import DisplayQuestion from './components/DisplayQuestion';

import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/stores/Lessons';

export const Reducers = [Lessons];

export class playScreen extends React.Component {
  constructor(props) {
    super(props);

    this.checkAnswer = this.checkAnswer.bind(this);
    this.onKeys = this.onKeys.bind(this);
    this.displayQuestion = this.displayQuestion.bind(this);
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
      } else if (keyDown === '0') {
        this.checkAnswer(this.props.processedQuestion.correctAlternative[0]);
      }
    }
  }

  checkAnswer(answer) {
    this.props.setAllButtonsDisabledState(true);

    this.props.addUserAnswer(answer);
    this.props.calcAnswerButtonStyles(answer);

    if (this.props.currentQuestionIndex < this.props.lessonLength - 1) {
      setTimeout(() => {
        this.props.incrementQuestionIndex();
        this.props.processCurrentQuestion();
        this.props.setAllButtonsDisabledState(false);
      }, 1000);
    } else {
      setTimeout(
        () => {
          this.props.setPageByName(`finish/${this.props.params.type}`);
        }, 1000);
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
    return resource ?
      <div>{resource}<br />{questionText[this.props.params.type]}</div> :
    questionText[this.props.params.type];
  }

  render() {
    return (
      <div>
        <Grid className="text-center">
          <DisplayQuestion type={this.props.params.type} />
          <br />
          <Row>
            <ButtonToolbar>
              <Col xs={6} sm={4} smOffset={2} md={3} mdOffset={3}>
                <AnswerButton
                  label={this.props.processedQuestion.randomizedAlternatives[0]}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.props.processedQuestion.buttonStyles[0]}
                  disableButton={this.props.processedQuestion.buttonDisabled || this.props.allButtonsDisabled}
                  answerType={this.props.answerType}
                />
              </Col>
              <Col xs={6} sm={4} md={3}>
                <AnswerButton
                  label={this.props.processedQuestion.randomizedAlternatives[1]}
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
                  label={this.props.processedQuestion.randomizedAlternatives[2]}
                  onAnswerClick={this.checkAnswer}
                  buttonStyle={this.props.processedQuestion.buttonStyles[2]}
                  disableButton={this.props.processedQuestion.buttonDisabled || this.props.allButtonsDisabled}
                  answerType={this.props.answerType}
                />
              </Col>
              <Col xs={6} sm={4} md={3}>
                <AnswerButton
                  label={this.props.processedQuestion.randomizedAlternatives[3]}
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
