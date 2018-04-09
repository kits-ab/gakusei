import { Button, Row, FormControl, FormGroup, Form } from 'react-bootstrap';

export default class AnswerButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: '',
      buttonText: 'Kontrollera svar'
    };
  }

  componentWillMount() {
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateAnswerText();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.questionAnswered) {
      this.setState({
        answerStyle: nextProps.questionAnsweredCorrectly ? 'success' : 'error',
        buttonText: 'Nästa fråga',
        clickFunc: this.props.clickNextCallback.bind(this)
      });
    } else {
      this.setState({ answer: '', answerStyle: null, buttonText: 'Kontrollera svar' });
      this.updateAnswerText();
    }
  }

  componentDidUpdate() {
    if (this.props.inputFocused) {
      this.answerInput.focus();
    } else if (this.state.buttonText === 'Nästa fråga') {
      // eslint-disable-next-line react/no-find-dom-node
      ReactDOM.findDOMNode(this)
        .querySelector('#nextButton')
        .focus();
    }
  }

  getOutput() {
    if (this.props.questionAnswered) {
      return (
        <Row>
          {this.props.questionAnsweredCorrectly ? (
            <h3>Rätt!</h3>
          ) : (
            <h3>Fel, rätt svar: {this.props.correctAlternative[0]}</h3>
          )}
        </Row>
      );
    }
    return (
      <Row>
        <h3>&nbsp;</h3>
      </Row>
    );
  }

  updateAnswerText(optionalValue = null) {
    this.setState({
      clickFunc: this.props.clickCallback.bind(this, optionalValue || this.state.answer || '')
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

  inputIsDisabled() {
    return this.state.buttonText === 'Nästa fråga' || this.props.buttonsDisabled;
  }

  handleSubmit(event) {
    event.preventDefault();
    this.state.clickFunc(event);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
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
            disabled={this.inputIsDisabled()}
            inputRef={ref => {
              this.answerInput = ref;
            }}
          />
          <FormControl.Feedback />
        </FormGroup>
        <FormGroup>
          <Button
            id="nextButton"
            type="submit"
            disabled={this.props.buttonsDisabled}
          >
            {this.state.buttonText}
          </Button>
        </FormGroup>
        {this.getOutput()}
      </Form>
    );
  }
}

AnswerButton.defaultProps = {
  secondaryText: null
};

AnswerButton.propTypes = {
  // alternatives: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)).isRequired,
  correctAlternative: PropTypes.arrayOf(PropTypes.string).isRequired,
  // buttonStyles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  buttonsDisabled: PropTypes.bool.isRequired,
  // japaneseCharacters: React.PropTypes.bool.isRequired,
  // answerType: React.PropTypes.string.isRequired,
  clickCallback: PropTypes.func.isRequired,
  clickNextCallback: PropTypes.func.isRequired,
  questionAnswered: PropTypes.bool.isRequired,
  questionAnsweredCorrectly: PropTypes.bool.isRequired,
  inputFocused: PropTypes.bool.isRequired
};
