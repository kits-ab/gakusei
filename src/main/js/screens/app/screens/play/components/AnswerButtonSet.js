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
          <Col
            xs={12}
            sm={6}
          >
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
          <Col
            xs={12}
            sm={6}
          >
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
          <Col
            xs={12}
            sm={6}
          >
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
          <Col
            xs={12}
            sm={6}
          >
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

AnswerButtonSet.defaultProps = {};

AnswerButtonSet.propTypes = {
  alternatives: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  buttonStyles: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonsDisabled: PropTypes.bool.isRequired,
  japaneseCharacters: PropTypes.bool.isRequired,
  answerType: PropTypes.string.isRequired,
  clickCallback: PropTypes.func.isRequired
};
