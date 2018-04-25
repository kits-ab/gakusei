import { Button, Collapse, Well } from 'react-bootstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faVolumeUp from '@fortawesome/fontawesome-free-solid/faVolumeUp';
import faQuestion from '@fortawesome/fontawesome-free-solid/faQuestion';
import Speech from '../../../shared/util/Speech';

export class DisplayQuestion extends React.Component {
  getQuestionText() {
    let text = this.props.primaryText || null;

    if (this.props.cardType === 'grammar') {
      const swedishText = this.props.inflection[1];
      const inflection = this.props.inflection[0];
      return (
        <p className="question__text question__text--type-verb">
          Ange böjningen för: <strong>{this.props.secondaryText} </strong>
          ({text}, {swedishText})
          <br />på formen: <strong> {inflection} </strong>
        </p>
      );
    } else if (this.props.secondaryText && this.props.secondaryText !== text) {
      if (this.props.japaneseCharacters) {
        text += ` 「${this.props.secondaryText}」`;
      } else {
        text += ` (${this.props.secondaryText})`;
      }
    }

    return <p className="question__text">{text}</p>;
  }

  getResource() {
    if (this.props.resourceRef && this.props.resourceRef.type === 'kanjidrawing') {
      return (
        <object
          fillOpacity="0.0"
          width="12%"
          height="12%"
          viewBox="-7 -85 534 540"
          type="image/svg+xml"
          data={this.props.resourceRef.location}
        >
          (SVG fel)
        </object>
      );
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fillOpacity="0.0"
        width="12%"
        height="12%"
        viewBox="-7 -85 534 540"
      />
    );
  }

  render() {
    const questionText = this.getQuestionText();
    const resource = this.getResource();
    const explanation = this.props.explanationText;

    return (
      <div className={'question' + (this.props.smallerText ? ' question--small' : '')}>
        {this.props.showKanji ? resource : null}
        {questionText}
        {this.props.japaneseCharacters && this.props.showSpeechButton ? (
          <div className="question__actions">
            <Button
              className="question__action"
              bsStyle="info"
              bsSize="xsmall"
              onClick={() => Speech.say(this.props.primaryText)}
            >
              <FontAwesomeIcon icon={faVolumeUp} />
            </Button>
            {explanation ? (
              <Button
                className="question__action"
                bsStyle="info"
                bsSize="xsmall"
                onClick={() => this.props.updateHintVisibility()}
              >
                <FontAwesomeIcon icon={faQuestion} />
              </Button>
            ) : null}
          </div>
        ) : null}
        {explanation ? (
          <div>
            <Collapse in={this.props.showHint}>
              <div>
                <Well className="question__hint">{explanation}</Well>
              </div>
            </Collapse>
          </div>
        ) : null}
      </div>
    );
  }
}

DisplayQuestion.defaultProps = {
  resourceRef: null,
  secondaryText: null,
  showSpeechButton: false,
  showKanji: false,
  smallerText: false,
  inflection: [],
  explanationText: null,
  cardType: ''
};

DisplayQuestion.propTypes = {
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string,
  japaneseCharacters: PropTypes.bool.isRequired,
  resourceRef: PropTypes.shape({
    type: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired
  }),
  showSpeechButton: PropTypes.bool,
  showKanji: PropTypes.bool,
  smallerText: PropTypes.bool,
  cardType: PropTypes.string,
  inflection: PropTypes.arrayOf(PropTypes.string),
  explanationText: PropTypes.string
};

export default DisplayQuestion;
