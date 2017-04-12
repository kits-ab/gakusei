import React from 'react';
import AnswerButtonSet from '../AnswerButtonSet';
import DisplayQuestion from '../../../../shared/DisplayQuestion';

class ButtonsCard extends React.Component {
  constructor(props) {
    super(props);

    /* devcode:start */
    this.onKeys = function (event) {
      const keyDown = event.key;
      if (!this.props.buttonsDisabled) {
        if (keyDown === '0') {
          this.props.clickCallback(this.props.question.correctAlternative[0]);
        }
      }
    }.bind(this);
    /* devcode:end */
  }

  componentDidMount() {
    /* devcode:start */
    window.addEventListener('keydown', this.onKeys);
    /* devcode:end */
  }

  componentWillUnmount() {
    /* devcode:start */
    window.removeEventListener('keydown', this.onKeys);
    /* devcode:end */
  }

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
        <AnswerButtonSet
          alternatives={this.props.question.randomizedAlternatives}
          buttonStyles={this.props.question.buttonStyles}
          japaneseCharacters={this.props.questionType === 'reading' && this.props.cardType !== 'quiz'}
          buttonsDisabled={this.props.buttonsDisabled}
          answerType={this.props.answerType}
          clickCallback={this.props.clickCallback}
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
    resourceRef: React.PropTypes.shape({
      type: React.PropTypes.string.isRequired,
      location: React.PropTypes.string.isRequired
    })
  }).isRequired,
  buttonsDisabled: React.PropTypes.bool.isRequired,
  answerType: React.PropTypes.string.isRequired,
  questionType: React.PropTypes.string.isRequired,
  clickCallback: React.PropTypes.func.isRequired,
  cardType: React.PropTypes.string.isRequired,
  questionAnswered: React.PropTypes.bool.isRequired,
  questionAnsweredCorrectly: React.PropTypes.bool.isRequired
};

export default ButtonsCard;
