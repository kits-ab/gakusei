import React from 'react';
import { Button } from 'react-bootstrap';
import Hypher from 'hypher';
import swedish from 'hyphenation.sv';
import { connect } from 'react-redux';
import * as Store from '../Store';


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
  const buttonLabel = hyphenateSwedish(props.label);
  const answerClickFunc = props.onAnswerClick.bind(this, props.label);

  return (
    <Button
      bsStyle={props.buttonStyle}
      bsSize="large" block
      onClick={answerClickFunc}
      disabled={props.disableButton}
      className="btn answerbutton"
    >
      {buttonLabel}
    </Button>
  );
};

AnswerButton.propTypes = {
  label: React.PropTypes.string.isRequired,
  buttonStyle: React.PropTypes.string.isRequired,
  onAnswerClick: React.PropTypes.func.isRequired,
  disableButton: React.PropTypes.bool.isRequired
};

export default connect(
    // Selects which state properties are merged into the component's props
    state => (state.reducer),
    // Selects which action creators are merged into the component's props
    Store.actionCreators
)(AnswerButton);
