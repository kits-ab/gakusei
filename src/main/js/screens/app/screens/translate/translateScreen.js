import React from 'react';
import { Button, Grid, Row, Col, FormControl, FormGroup } from 'react-bootstrap';
import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/reducers/Lessons';
import * as Security from '../../../../shared/reducers/Security';

import DisplayQuestion from '../../shared/DisplayQuestion';

export const Reducers = [Lessons, Security];

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
          <h3>Rätt!</h3> : <h3>Fel, rätt svar: {this.props.processedQuestion.correctAlternative[0]}</h3>) }
      </Row>);
    }
    return '';
  }

  checkAnswer() {
    this.props.addUserAnswer(this.state.answer);

    this.setState({
      answerStyle: (this.props.processedQuestion.correctAlternative.some(ca => ca === this.state.answer)
       ? 'success' :
         'error'),
      disabledButtons: true });

    if (this.props.currentQuestionIndex < this.props.lessonLength - 1) {
      setTimeout(() => {
        this.setState({
          answer: '',
          answerStyle: null,
          disabledButtons: false });
        this.props.incrementQuestionIndex();
        this.props.processCurrentQuestion();
      }, window.customDelay /* not really accessible, just for e2e testing */ || 1500);
    } else {
      setTimeout(
        () => {
          this.props.setPageByName(`finish/${this.props.params.type}`);
        }, window.customDelay /* not really accessible, just for e2e testing */ || 1500);
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
          <Col xs={12} sm={6} smOffset={3}>
            <Row>
              <DisplayQuestion
                primaryText={this.props.processedQuestion.actualQuestionShapes[0]}
                secondaryText={this.props.processedQuestion.actualQuestionShapes[1] || null}
                resourceRef={this.props.processedQuestion.resourceRef}
                japaneseCharacters={this.props.questionType === 'reading'}
                showSpeechButton
                showKanji
              />
            </Row>
            <FormGroup
              validationState={this.state.answerStyle}
              controlId="translateTextArea"
            >
              <FormControl
                type="text"
                name="translateText"
                placeholder="Ditt svar"
                value={this.state.answer}
                onChange={this.handleChange}
                disabled={this.state.disabledButtons}
              />
              <FormControl.Feedback />
            </FormGroup>
            <Row>
              <Button type="submit" onClick={this.checkAnswer} disabled={this.state.disabledButtons}>
              Kontrollera svar
            </Button>
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
          </Col>
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
