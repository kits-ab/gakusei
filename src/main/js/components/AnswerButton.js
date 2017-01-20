import React from 'react';
import { Button } from 'react-bootstrap';
import Hypher from 'hypher';
import swedish from 'hyphenation.sv';

const AnswerButton = (props) => {
  const buttonLabel = hyphenateSwedish(props.label);
  return (
    <Button
      bsStyle={props.buttonStyle}
      bsSize="large" block
      onClick={props.onAnswerClick.bind(this, props.label)}
      disabled={props.disableButton}
      className="btn answerbutton"
    >
      {buttonLabel}
    </Button>
  );
};

function hyphenateSwedish(text) {
  // Threshold to avoid unnecessary hyphenation
  const hyphenateThreshold = 10;
  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > hyphenateThreshold) {
      let h = new Hypher(swedish);
      return h.hyphenateText(text);
    }
  }
  return text;
}

export default AnswerButton;
