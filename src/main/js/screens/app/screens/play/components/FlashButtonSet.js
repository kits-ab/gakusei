import React from 'react';
import { Row, Col } from 'react-bootstrap';
import AnswerButton from './AnswerButton';

export default class FlashButtonSet extends React.Component {
  constructor(props) {
    super(props);
    this.onKeys = this.onKeys.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeys);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeys);
  }

  onKeys(event) {
    const keyDown = event.key;
    if (!this.props.buttonsDisabled) {
      if (keyDown === '1') {
        this.props.clickCallback(this.props.correctAlternative[0]);
      } else if (keyDown === '2') {
        this.props.clickCallback('I don\'t know');
      }
    }
  }

  render() {
    return (
      <div>
        <Col xs={4} xsOffset={2} sm={4} smOffset={2} md={3} mdOffset={3} >
          <AnswerButton
            answerText={this.props.correctAlternative[0]}
            primaryText={'Ja'}
            onAnswerClick={this.props.clickCallback}
            buttonStyle={'success'}
            buttonSize="small"
            disableButton={this.props.buttonsDisabled}
            answerType={this.props.answerType}
            name="answerbutton-1"
          />
        </Col>
        <Col xs={4} sm={4} md={3}>
          <AnswerButton
            answerText={'Vet ej'}
            primaryText={'Nej'}
            onAnswerClick={this.props.clickCallback}
            buttonStyle={'danger'}
            buttonSize="small"
            disableButton={this.props.buttonsDisabled}
            answerType={this.props.answerType}
            name="answerbutton-2"
          />
        </Col>
      </div>
    );
  }
}

FlashButtonSet.defaultProps = {

};

FlashButtonSet.propTypes = {
  correctAlternative: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  buttonStyles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  buttonsDisabled: React.PropTypes.bool.isRequired,
  answerType: React.PropTypes.string.isRequired,
  clickCallback: React.PropTypes.func.isRequired
};
