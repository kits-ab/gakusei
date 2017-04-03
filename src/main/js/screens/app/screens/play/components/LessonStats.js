import React from 'react';
import { Row } from 'react-bootstrap';

class LessonStats extends React.Component {
  state = { }
  render() {
    return (
      <Row>
        <div>
          <p>
            Fråga: {this.props.currentQuestionNumber} / {this.props.totalQuestionsNumber}
          </p>
          <p>
            {this.props.correctAttempts} rätt {this.props.lessonSuccessRateMessage}
          </p>
        </div>
      </Row>
    );
  }
}

LessonStats.propTypes = {
  currentQuestionNumber: React.PropTypes.number.isRequired,
  totalQuestionsNumber: React.PropTypes.number.isRequired,
  correctAttempts: React.PropTypes.number.isRequired,
  lessonSuccessRateMessage: React.PropTypes.string.isRequired
};

export default LessonStats;
