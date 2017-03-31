import React from 'react';
import { Row, Col } from 'react-bootstrap';
import AnswerButton from './AnswerButton';

export default class AnswerButtonSet extends React.Component {
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
        this.props.clickCallback(this.props.alternatives[0][0]);
      } else if (keyDown === '2') {
        this.props.clickCallback(this.props.alternatives[1][0]);
      } else if (keyDown === '3') {
        this.props.clickCallback(this.props.alternatives[2][0]);
      } else if (keyDown === '4') {
        this.props.clickCallback(this.props.alternatives[3][0]);
      }
    }
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={6} sm={5} smOffset={1}>
            <AnswerButton
              primaryText={this.props.alternatives[0][0]}
              secondaryText={this.props.alternatives[0][1] || null}
              japaneseCharacters={this.props.japaneseCharacters}
              onAnswerClick={this.props.clickCallback}
              buttonStyle={this.props.buttonStyles[0]}
              disableButton={this.props.buttonsDisabled}
              answerType={this.props.answerType}
              name="answerbutton-1"
            />
          </Col>
          <Col xs={6} sm={5}>
            <AnswerButton
              primaryText={this.props.alternatives[1][0]}
              secondaryText={this.props.alternatives[1][1] || null}
              japaneseCharacters={this.props.japaneseCharacters}
              onAnswerClick={this.props.clickCallback}
              buttonStyle={this.props.buttonStyles[1]}
              disableButton={this.props.buttonsDisabled}
              answerType={this.props.answerType}
              name="answerbutton-2"
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={6} sm={5} smOffset={1}>
            <AnswerButton
              primaryText={this.props.alternatives[2][0]}
              secondaryText={this.props.alternatives[2][1] || null}
              japaneseCharacters={this.props.japaneseCharacters}
              onAnswerClick={this.props.clickCallback}
              buttonStyle={this.props.buttonStyles[2]}
              disableButton={this.props.buttonsDisabled}
              answerType={this.props.answerType}
              name="answerbutton-3"
            />
          </Col>
          <Col xs={6} sm={5}>
            <AnswerButton
              primaryText={this.props.alternatives[3][0]}
              secondaryText={this.props.alternatives[3][1] || null}
              japaneseCharacters={this.props.japaneseCharacters}
              onAnswerClick={this.props.clickCallback}
              buttonStyle={this.props.buttonStyles[3]}
              disableButton={this.props.buttonsDisabled}
              answerType={this.props.answerType}
              name="answerbutton-4"
            />
          </Col>
        </Row>
      </div>
    );
  }
}

AnswerButtonSet.defaultProps = {

};

AnswerButtonSet.propTypes = {
  alternatives: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)).isRequired,
  buttonStyles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  buttonsDisabled: React.PropTypes.bool.isRequired,
  japaneseCharacters: React.PropTypes.bool.isRequired,
  answerType: React.PropTypes.string.isRequired,
  clickCallback: React.PropTypes.func.isRequired
};
