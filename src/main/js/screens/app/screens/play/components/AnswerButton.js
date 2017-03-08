import React from 'react';
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
    this.updateAnswerText(this.props.primaryText);
  }

  componentWillReceiveProps(nextProps) {
    this.updateAnswerText(nextProps.primaryText);
  }

  getPrimaryText() {
    if (this.props.answerType === 'swedish') {
      return hyphenateSwedish(this.props.primaryText);
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
    this.state = {
      answerClickFunc: this.props.onAnswerClick.bind(this, text)
    };
  }

  render() {
    return (
      <Button
        bsStyle={this.props.buttonStyle}
        bsSize="large" block
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
  secondaryText: null
};

AnswerButton.propTypes = {
  name: React.PropTypes.string.isRequired,
  primaryText: React.PropTypes.string.isRequired,
  secondaryText: React.PropTypes.string,
  buttonStyle: React.PropTypes.string.isRequired,
  onAnswerClick: React.PropTypes.func.isRequired,
  disableButton: React.PropTypes.bool.isRequired,
  answerType: React.PropTypes.string.isRequired,
  japaneseCharacters: React.PropTypes.bool.isRequired
};
