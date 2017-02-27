import React from 'react';
import { Button } from 'react-bootstrap';
import Hypher from 'hypher';
import swedish from 'hyphenation.sv';

export default class AnswerButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answerClickFunc: this.props.onAnswerClick.bind(this, this.props.primaryText)
    };
  }

  getPrimaryText() {
    if (this.props.answerType === 'swedish') {
      return this.hyphenateSwedish(this.props.primaryText);
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

  hyphenateSwedish(text) {
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

  render() {
    return (
      <Button
        bsStyle={this.props.buttonStyle}
        bsSize="large" block
        onClick={this.state.answerClickFunc}
        disabled={this.props.disableButton}
        className="btn answerbutton btn-no-hover"
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
  primaryText: React.PropTypes.string.isRequired,
  secondaryText: React.PropTypes.string,
  buttonStyle: React.PropTypes.string.isRequired,
  onAnswerClick: React.PropTypes.func.isRequired,
  disableButton: React.PropTypes.bool.isRequired,
  answerType: React.PropTypes.string.isRequired,
  japaneseCharacters: React.PropTypes.bool.isRequired
};
