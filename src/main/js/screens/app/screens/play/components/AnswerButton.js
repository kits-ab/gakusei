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

const AnswerButton = (props) => {
  let reading;
  let writing = '';
  if (props.answerType === 'swedish') {
    reading = hyphenateSwedish(props.label[0]);
  } else {
    writing = props.label[1] !== '' ? 'Writing: '.concat(props.label[1]) : '';
    reading = ('Reading: '.concat(props.label[0]));
  }
  const answerClickFunc = props.onAnswerClick.bind(this, props.label[0]);

  return (
    <Button
      bsStyle={props.buttonStyle}
      bsSize="large" block
      onClick={answerClickFunc}
      disabled={props.disableButton}
      className="btn answerbutton"
    >
      {reading}<br />{writing}
    </Button>
  );
};

AnswerButton.propTypes = {
  label: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  buttonStyle: React.PropTypes.string.isRequired,
  onAnswerClick: React.PropTypes.func.isRequired,
  disableButton: React.PropTypes.bool.isRequired,
  answerType: React.PropTypes.string.isRequired
};

export default AnswerButton;
