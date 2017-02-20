import React from 'react';
import { connect } from 'react-redux';
import * as Lessons from '../../../../../shared/stores/Lessons';

export class DisplayQuestion extends React.Component {
  getQuestionText(type) {
    let guessPlayDisplay;
    if (this.props.questionType === 'reading') {
      guessPlayDisplay = (
        <div>
          <h2>Läsform: {this.props.processedQuestion.actualQuestionShapes[0]}</h2>
          {this.props.processedQuestion.length > 1 ? <h2>Writing: {this.props.processedQuestion.actualQuestionShapes[1]}</h2> : <div />}
        </div>);
    } else {
      guessPlayDisplay = <h2>{this.props.processedQuestion.actualQuestionShapes[0]}</h2>;
    }
    const questionText = {
      guess: guessPlayDisplay,
      quiz: <h2>{this.props.processedQuestion.actualQuestionShapes[0]}</h2>
    };

    return questionText[type];
  }

  getResource() {
    let resource;
    if (this.props.processedQuestion.resourceRef && this.props.processedQuestion.resourceRef.type === 'kanjidrawing') {
      resource = <object height="50em" type="image/svg+xml" data={this.props.processedQuestion.resourceRef.location}>SVG error</object>;
    }
    return resource;
  }

  render() {
    const resource = this.getResource();
    return (
    resource ?
      <div>{resource}<br />{this.getQuestionText(this.props.type)}</div>
    : this.getQuestionText(this.props.type)
    );
  }
}

DisplayQuestion.propTypes = {

  questionType: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  processedQuestion: React.PropTypes.shape({
    length: React.PropTypes.number,
    actualQuestionShapes: React.PropTypes.array.isRequired,
    correctAlternative: React.PropTypes.array.isRequired,
    randomizedAlternatives: React.PropTypes.array.isRequired,
    buttonStyles: React.PropTypes.array.isRequired,
    buttonDisabled: React.PropTypes.bool.isRequired,
    resourceRef: React.PropTypes.object }).isRequired
};

export default connect(
    // Selects which state properties are merged into the component's props
    state => (state.lessons),
    // Selects which action creators are merged into the component's props
    Lessons.actionCreators
)(DisplayQuestion);
