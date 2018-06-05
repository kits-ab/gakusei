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
          explanationText={this.props.question.explanationText || null}
          resourceRef={this.props.question.resourceRef}
          japaneseCharacters={this.props.questionType === 'reading' && this.props.cardType !== 'quiz'}
          cardType={this.props.cardType}
          updateHintVisibility={this.props.updateHintVisibility}
          showHint={this.props.showHint}
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

ButtonsCard.defaultProps = {};

ButtonsCard.propTypes = {
  question: PropTypes.shape({
    shapes: PropTypes.arrayOf(PropTypes.string),
    randomizedAlternatives: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    buttonStyles: PropTypes.arrayOf(PropTypes.string).isRequired,
    resourceRef: PropTypes.string,
    explanationText: PropTypes.string
  }).isRequired,
  buttonsDisabled: PropTypes.bool.isRequired,
  questionType: PropTypes.string.isRequired,
  clickCallback: PropTypes.func.isRequired,
  clickNextCallback: PropTypes.func.isRequired,
  cardType: PropTypes.string.isRequired,
  questionAnswered: PropTypes.bool.isRequired,
  questionAnsweredCorrectly: PropTypes.bool.isRequired,
  inputFocused: PropTypes.bool.isRequired,
  updateHintVisibility: PropTypes.func.isRequired,
  showHint: PropTypes.bool.isRequired
};

export default ButtonsCard;
