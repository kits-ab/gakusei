import { Row } from 'react-bootstrap';
import { translate } from 'react-i18next';

class LessonStats extends React.Component {
  state = {};
  render() {
    const { t, i18n } = this.props;

    const feedbackList = this.props.feedbackItems.map((item, index) => {
      let correctnessText = null;
      if (item.correct) {
        correctnessText = `Tecknet är korrekt. Generell ritstil var ${item.text}.`;
      } else {
        correctnessText = `Ditt tecken innehöll ${item.errorCount} fel.`;
      }

      return `#${index + 1}: ${correctnessText}`;
    });

    return (
      <Row>
        <div>
          <p>
            {t('aboutGakusei.finishScreen.question')} {this.props.currentQuestionNumber} /{' '}
            {this.props.totalQuestionsNumber}
          </p>
          <p>
            {this.props.correctAttempts} {t('aboutGakusei.finishScreen.Right')} {this.props.lessonSuccessRateMessage}
          </p>
          {/* {this.props.lessonType === 'kanji'
            ? feedbackList.reverse().map((item, index) => {
              if (index === 0) {
                return <h2 key={item}>{item}</h2>;
              }
              return <p key={item}>{item}</p>;
            })
            : null} */}
        </div>
      </Row>
    );
  }
}

LessonStats.defaultProps = {};

LessonStats.propTypes = {
  feedbackItems: PropTypes.arrayOf(
    PropTypes.shape({
      correct: PropTypes.bool.isRequired,
      errorCount: PropTypes.number.isRequired,
      text: PropTypes.string
    })
  ).isRequired,

  currentQuestionNumber: PropTypes.number.isRequired, // Deprecated
  totalQuestionsNumber: PropTypes.number.isRequired,
  correctAttempts: PropTypes.number.isRequired, // Deprecated
  lessonSuccessRateMessage: PropTypes.string.isRequired,
  lessonType: PropTypes.string.isRequired
};

export default translate('translations')(LessonStats);
