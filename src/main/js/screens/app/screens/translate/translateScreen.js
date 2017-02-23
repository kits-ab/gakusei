

import React from 'react';
import { Button, Grid, Row } from 'react-bootstrap';
import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/stores/Lessons';

export const Reducers = [Lessons];

export class translateScreen extends React.Component {
  constructor(props) {
    super(props);

    this.checkAnswer = this.checkAnswer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.displayQuestion = this.displayQuestion.bind(this);
  }
  componentWillMount() {
    this.setState({ answer: '' });
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

  checkAnswer() {
    this.props.addUserAnswer(this.state.answer);

    if (this.props.currentQuestionIndex < this.props.lessonLength - 1) {
      setTimeout(() => {
        this.setState({ answer: '' });
        this.props.incrementQuestionIndex();
        this.props.processCurrentQuestion();
      }, 1000);
    } else {
      setTimeout(
        () => {
          this.props.setPageByName(`finish/${this.props.params.type}`);
        }, 1000);
    }
  }

  handleChange(event) {
    this.setState({ answer: event.target.value });
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

translateScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

translateScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);


export default Utility.superConnect(this, Reducers)(translateScreen);
