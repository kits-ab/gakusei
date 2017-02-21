import React from 'react';
import Utility from '../../../../../shared/util/Utility';
import * as Lessons from '../../../../../shared/stores/Lessons';

export const Reducers = [Lessons];

export class DisplayQuestion extends React.Component {
  getQuestionText(type) {
    let guessPlayDisplay;
    if (this.props.questionType === 'reading') {
      guessPlayDisplay = (
        <div>
          <h2>Läsform: {this.props.processedQuestion.actualQuestionShapes[0]}</h2>
          {this.props.processedQuestion.length > 1 ?
            <h2>Writing: {this.props.processedQuestion.actualQuestionShapes[1]}</h2>
          : <div />}
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
      resource = (<object
        height="50em" type="image/svg+xml"
        data={this.props.processedQuestion.resourceRef.location}
      >SVG error</object>);
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

DisplayQuestion.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

DisplayQuestion.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);


export default Utility.superConnect(this, Reducers)(DisplayQuestion);
