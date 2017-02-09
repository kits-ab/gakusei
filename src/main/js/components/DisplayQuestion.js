import React from 'react';

export default class DisplayQuestion extends React.Component {
  render() {
    let questionText;
    if (this.props.questionType === 'reading') {
      questionText = {
        GuessPlayPage: (
          <div>
            <h2>Läsform: {this.props.question[0]}</h2>
            <h2>Skrivform: {(this.props.question.length > 1) ? this.props.question[1] : ''}</h2>
          </div>
        ),
        QuizPlayPage: <h2>{this.props.question[0]}</h2>
      };
    } else {
      questionText = {
        GuessPlayPage: <h2>{this.props.question[0]}</h2>,
        QuizPlayPage: <h2>{this.props.question[0]}</h2>
      };
    }
    let resource;
    if (this.props.resourceRef && this.props.resourceRef.type === 'kanjidrawing') {
      resource = <object height="50em" type="image/svg+xml" data={this.props.resourceRef.location}>SVG error</object>;
    }
    return (
      resource ? <div>{resource}<br />{questionText[this.props.pageName]}</div> : questionText[this.props.pageName]
    );
  }
}

DisplayQuestion.propTypes = {
  questionType: React.PropTypes.string.isRequired,
  question: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  pageName: React.PropTypes.string.isRequired
};
