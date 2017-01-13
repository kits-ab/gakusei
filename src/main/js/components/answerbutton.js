import React from 'react';
import {Button} from 'react-bootstrap';
import Hypher from 'hypher';
import swedish from 'hyphenation.sv';

export default class AnswerButton extends React.Component {
    render() {
        let buttonLabel = hyphenateSwedish(this.props.label);
        return (
            <Button bsStyle={this.props.buttonStyle}
               bsSize='large' block
               onClick={this.props.onAnswerClick.bind(this, this.props.label)}
               disabled = {this.props.disableButton}
               className={'btn answerbutton'}>
               {buttonLabel}
            </Button>
        );
    }
}

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
