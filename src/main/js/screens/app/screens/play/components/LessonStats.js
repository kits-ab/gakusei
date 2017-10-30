import React from 'react';
import { Row } from 'react-bootstrap';

class LessonStats extends React.Component {
  state = { }
  render() {
    const feedbackList = this.props.feedbackItems.map((item, index) => {
      let correctnessText = null;
      if (item.correct) {
        correctnessText = `Tecknet är korrekt. Generell ritstil var ${item.text}.`;
      } else {
        correctnessText = `Ditt tecken innehöll ${item.errorCount} fel.`;
      }

      return (`#${index + 1}: ${correctnessText}`);
    });

    return (
      <Row>
        <div>
          <p>
            Fråga: {this.props.currentQuestionNumber} / {this.props.totalQuestionsNumber}
          </p>
          <p>
            {this.props.correctAttempts} rätt {this.props.lessonSuccessRateMessage}
          </p>
          {this.props.lessonType === 'kanji' ?
            feedbackList.reverse().map((item, index) => {
            if (index === 0) {
              return (<h2 key={item}>{item}</h2>);
            }
            return (<p>{item}</p>);
          }) : null}
        </div>
      </Row>
    );
  }
}

LessonStats.defaultProps = {

};

LessonStats.propTypes = {
  feedbackItems: React.PropTypes.arrayOf(React.PropTypes.shape({
    correct: React.PropTypes.bool.isRequired,
    errorCount: React.PropTypes.number.isRequired,
    text: React.PropTypes.string
  })).isRequired,

  currentQuestionNumber: React.PropTypes.number.isRequired, // Deprecated
  totalQuestionsNumber: React.PropTypes.number.isRequired,
  correctAttempts: React.PropTypes.number.isRequired, // Deprecated
  lessonSuccessRateMessage: React.PropTypes.string.isRequired,
  lessonType: React.PropTypes.string.isRequired
};

export default LessonStats;
