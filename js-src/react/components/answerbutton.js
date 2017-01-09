import React from 'react';
import {Button} from 'react-bootstrap';

export default class AnswerButton extends React.Component {
    render() {
        return (
            <Button bsStyle={this.props.buttonStyle}
               bsSize='large' block
               onClick={this.props.onAnswerClick.bind(this, this.props.label)}
               disabled = {this.props.disableButton}
               className={'btn answerbutton hyphenation'}>
               {this.props.label}
            </Button>
        );
    }
}