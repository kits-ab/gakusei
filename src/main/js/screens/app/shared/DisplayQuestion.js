import { Glyphicon, Button, Collapse, Well } from 'react-bootstrap';
import Speech from '../../../shared/util/Speech';

export class DisplayQuestion extends React.Component {
  getQuestionText() {
    let text = this.props.primaryText || null;

    if (this.props.cardType === 'grammar') {
      const swedishText = this.props.inflection[1];
      const inflection = this.props.inflection[0];
      return (
        <div>
          <p className="verbQuestionText">
            Ange böjningen för: <strong>{this.props.secondaryText} </strong>
            ({text}, {swedishText})
            <br />på formen: <strong> {inflection} </strong>
          </p>
        </div>
      );
    } else if (this.props.secondaryText && this.props.secondaryText !== text) {
      if (this.props.japaneseCharacters) {
        text += ` 「${this.props.secondaryText}」`;
      } else {
        text += ` (${this.props.secondaryText})`;
      }
    }

    return <p className="questionText">{text}</p>;
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
    const speechButtonStyle = {
      fontSize: this.props.smallerText ? '1.0em' : '1.6em',
      position: 'inherit',
      verticalAlign: 'middle',
      padding: '2px 1px 2px 1px'
    };
    const buttonStyle = {
      position: 'inherit',
      verticalAlign: 'middle',
      margin: '5px 5px 10px 5px'
    };
    const generalStyle = {
      fontSize: this.props.smallerText ? '0.5em' : '1.0em'
    };

    return (
      <div style={generalStyle}>
        {this.props.showKanji ? resource : null}
        {questionText}
        <div>
          {this.props.japaneseCharacters && this.props.showSpeechButton ? (
            <span>
              <Button
                style={buttonStyle}
                bsStyle="info"
                bsSize="xsmall"
                onClick={() => Speech.say(this.props.primaryText)}
              >
                <Glyphicon
                  style={speechButtonStyle}
                  glyph="volume-up"
                />
              </Button>
              {explanation ? (
                <Button
                  style={buttonStyle}
                  bsStyle="info"
                  bsSize="xsmall"
                  onClick={() => this.props.updateHintVisibility()}
                >
                  <Glyphicon
                    style={speechButtonStyle}
                    glyph={'question-sign'}
                  />
                </Button>
              ) : null}
            </span>
          ) : null}
          {explanation ? (
            <div>
              <Collapse in={this.props.showHint}>
                <div>
                  <Well className="hintText">{explanation}</Well>
                </div>
              </Collapse>
            </div>
          ) : null}
        </div>
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
