/* global sessionStorage*/

import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Row } from 'react-bootstrap';
import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/stores/Lessons';

export class TranslationPlayPage extends React.Component {
  constructor(props) {
    super(props);

    this.checkAnswer = this.checkAnswer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.displayQuestion = this.displayQuestion.bind(this);
  }
  componentWillMount() {
    // this.props.resetLesson();
    this.setState({ answer: '' });
  }

  handleChange(event) {
    this.setState({ answer: event.target.value });
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

  getOutput() {
    if (this.props.currentProcessedQuestionAnswered) {
      return (<Row>
        { (this.props.currentProcessedQuestionAnsweredCorrectly ?
          <h3>Rätt!</h3> : <h3>Fel..</h3>) }
      </Row>);
    }
    return '';
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
  // loggedInUser: React.PropTypes.string.isRequired
};

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    // Selects which state properties are merged into the component's props
    state => (state.lessons),
    // Selects which action creators are merged into the component's props
    Lessons.actionCreators
)(TranslationPlayPage);
