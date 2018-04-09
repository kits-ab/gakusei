import { Button } from 'react-bootstrap';
import Hypher from 'hypher';
import swedish from 'hyphenation.sv';

function hyphenateSwedish(text) {
  // Threshold to avoid unnecessary hyphenation
  const hyphenateThreshold = 10;
  const words = text.split(' ');
  for (let i = 0; i < words.length; i += 1) {
    if (words[i].length > hyphenateThreshold) {
      const h = new Hypher(swedish);
      return h.hyphenateText(text);
    }
  }
  return text;
}

export default class AnswerButton extends React.Component {
  componentWillMount() {
    this.updateAnswerText(this.props.answerText || this.props.primaryText);
  }

  componentWillReceiveProps(nextProps) {
    this.updateAnswerText(nextProps.answerText || nextProps.primaryText);
  }

  getPrimaryText() {
    if (this.props.answerType === 'swedish') {
      return hyphenateSwedish(this.props.primaryText || this.props.answerText);
    }

    return this.props.primaryText || null;
  }

  getSecondaryText() {
    if (this.props.secondaryText && this.props.secondaryText !== this.props.primaryText) {
      if (this.props.japaneseCharacters) {
        return `「${this.props.secondaryText}」`;
      }
      return `(${this.props.secondaryText})`;
    }
    return null;
  }

  updateAnswerText(text) {
    // eslint-disable-next-line react/no-direct-mutation-state
    this.setState({
      answerClickFunc: this.props.onAnswerClick.bind(this, text)
    });
  }

  render() {
    return (
      <Button
        style={this.props.buttonSize === 'large' ? { height: '5em' } : { height: '3em' }}
        bsStyle={this.props.buttonStyle}
        bsSize={this.props.buttonSize}
        block
        onClick={this.state.answerClickFunc}
        disabled={this.props.disableButton}
        className="btn answerbutton btn-no-hover"
        name={this.props.name}
      >
        {this.getPrimaryText()}
        <br />
        {this.getSecondaryText()}
      </Button>
    );
  }
}

AnswerButton.defaultProps = {
  secondaryText: null,
  answerText: null,
  japaneseCharacters: false,
  buttonSize: 'large'
};

AnswerButton.propTypes = {
  name: PropTypes.string.isRequired,
  answerText: PropTypes.string,
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string,
  buttonStyle: PropTypes.string.isRequired,
  onAnswerClick: PropTypes.func.isRequired,
  disableButton: PropTypes.bool.isRequired,
  answerType: PropTypes.string.isRequired,
  japaneseCharacters: PropTypes.bool,
  buttonSize: PropTypes.string.isRequired
};
