import React from 'react';
import { Grid, Row } from 'react-bootstrap';
import AnswerButtonSet from '../AnswerButtonSet';
import AnswerTextInput from '../AnswerTextInput';
import DisplayQuestion from '../../../../shared/DisplayQuestion';

class ButtonsCard extends React.Component {
  render() {
    return (
      <div>
        <DisplayQuestion
          primaryText={this.props.question.shapes[0]}
          secondaryText={this.props.question.shapes[1] || null}
          resourceRef={this.props.question.resourceRef}
          japaneseCharacters={this.props.questionType === 'reading' && this.props.cardType !== 'quiz'}
          showSpeechButton
          showKanji
        />
        <AnswerTextInput
          buttonsDisabled={this.props.buttonsDisabled}
          clickCallback={this.props.clickCallback}
          questionAnswered={this.props.questionAnswered}
          questionAnsweredCorrectly={this.props.questionAnsweredCorrectly}
          correctAlternative={this.props.correctAlternative}
        />
      </div>
    );
  }
}

ButtonsCard.defaultProps = {

};

ButtonsCard.propTypes = {
  question: React.PropTypes.shape({
    shapes: React.PropTypes.arrayOf(React.PropTypes.string),
    randomizedAlternatives: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)).isRequired,
    buttonStyles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    resourceRef: React.PropTypes.string
  }).isRequired,
  buttonsDisabled: React.PropTypes.bool.isRequired,
  answerType: React.PropTypes.string.isRequired,
  questionType: React.PropTypes.string.isRequired,
  clickCallback: React.PropTypes.func.isRequired,
  cardType: React.PropTypes.string.isRequired,
  correctAlternative: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  questionAnswered: React.PropTypes.bool.isRequired,
  questionAnsweredCorrectly: React.PropTypes.bool.isRequired
};

export default ButtonsCard;
