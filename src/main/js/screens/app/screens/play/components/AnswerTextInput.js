import React from 'react';
import { Button, Row, FormControl, FormGroup } from 'react-bootstrap';

export default class AnswerButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: ''
    };
  }

  componentWillMount() {
    this.handleChange = this.handleChange.bind(this);
    this.updateAnswerText();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.questionAnswered) {
      this.setState({
        answerStyle: (nextProps.questionAnsweredCorrectly ?
          'success' :
          'error'
        )
      });
    } else {
      this.setState({ answer: '', answerStyle: null });
      this.updateAnswerText();
    }
  }

  getOutput() {
    if (this.props.questionAnswered) {
      return (<Row>
        { (this.props.questionAnsweredCorrectly ?
          <h3>Rätt!</h3> : <h3>Fel, rätt svar: {this.props.correctAlternative[0]}</h3>) }
      </Row>);
    }
    return (<Row><h3>&nbsp;</h3></Row>);
  }

  updateAnswerText(optionalValue = null) {
    this.setState({
      answerClickFunc: this.props.clickCallback.bind(this, optionalValue || this.state.answer || '')
    });
  }

  calcInputStyle() {
    if (this.props.questionAnswered) {
      if (this.props.questionAnsweredCorrectly) {
        this.setState({ inputStyle: 'success' });
      } else {
        this.setState({ inputStyle: 'error' });
      }
    }
    return null;
  }

  handleChange(event) {
    this.setState({ answer: event.target.value });
    this.updateAnswerText(event.target.value);
  }

  render() {
    return (
      <div>
        <FormGroup
          controlId="translateTextArea"
          validationState={this.state.answerStyle}
        >
          <FormControl
            type="text"
            name="translateText"
            placeholder="Ditt svar"
            value={this.state.answer}
            onChange={this.handleChange}
            disabled={this.props.buttonsDisabled}
          />
          <FormControl.Feedback />
        </FormGroup>
        <Row>
          <Button type="submit" onClick={this.state.answerClickFunc} disabled={this.state.buttonsDisabled}>
              Kontrollera svar
            </Button>
        </Row>
        { this.getOutput() }
      </div>
    );
  }
}

AnswerButton.defaultProps = {
  secondaryText: null
};

AnswerButton.propTypes = {
  // alternatives: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)).isRequired,
  correctAlternative: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  // buttonStyles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  buttonsDisabled: React.PropTypes.bool.isRequired,
  // japaneseCharacters: React.PropTypes.bool.isRequired,
  // answerType: React.PropTypes.string.isRequired,
  clickCallback: React.PropTypes.func.isRequired,
  questionAnswered: React.PropTypes.bool.isRequired,
  questionAnsweredCorrectly: React.PropTypes.bool.isRequired
};
