import React from 'react';
import AnswerTextInput from '../AnswerTextInput';
import DisplayQuestion from '../../../../shared/DisplayQuestion';

class ButtonsCard extends React.Component {
  render() {
    return (
      <div>
        <DisplayQuestion
          primaryText={this.props.question.shapes[0]}
          secondaryText={this.props.question.shapes[1] || null}
          inflection={this.props.question.shapes.slice(2) || null}
          resourceRef={this.props.question.resourceRef}
          japaneseCharacters={this.props.questionType === 'reading' && this.props.cardType !== 'quiz'}
          cardType={this.props.cardType}
          showSpeechButton
          showKanji
        />
        <AnswerTextInput
          buttonsDisabled={this.props.buttonsDisabled}
          clickCallback={this.props.clickCallback}
          clickNextCallback={this.props.clickNextCallback}
          questionAnswered={this.props.questionAnswered}
          questionAnsweredCorrectly={this.props.questionAnsweredCorrectly}
          correctAlternative={this.props.correctAlternative}
          inputFocused={this.props.inputFocused}
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
  questionType: React.PropTypes.string.isRequired,
  clickCallback: React.PropTypes.func.isRequired,
  clickNextCallback: React.PropTypes.func.isRequired,
  cardType: React.PropTypes.string.isRequired,
  correctAlternative: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  questionAnswered: React.PropTypes.bool.isRequired,
  questionAnsweredCorrectly: React.PropTypes.bool.isRequired,
  inputFocused: React.PropTypes.bool.isRequired,
};

export default ButtonsCard;
