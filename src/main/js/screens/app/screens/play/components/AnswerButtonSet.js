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
        this.props.clickCallback(this.props.alternatives[0][0], this.props);
      } else if (keyDown === '2') {
        this.props.clickCallback(this.props.alternatives[1][0], this.props);
      } else if (keyDown === '3') {
        this.props.clickCallback(this.props.alternatives[2][0], this.props);
      } else if (keyDown === '4') {
        this.props.clickCallback(this.props.alternatives[3][0], this.props);
      }
    }
  }

  render() {
    let x = -1;
    const answerButtons = this.props.alternatives.map(() => {
      x++;
      if (this.props.alternatives.length > 2 && this.props.alternatives.length < 4) {
        return (
          <Col
            key={x}
            xs={12}
            sm={6}
            smOffset={3}
          >
            <AnswerButton
              primaryText={this.props.alternatives[x][0]}
              secondaryText={this.props.alternatives[x][1] || null}
              japaneseCharacters={this.props.japaneseCharacters}
              onAnswerClick={this.props.clickCallback}
              buttonStyle={this.props.buttonStyles[x]}
              disableButton={this.props.buttonsDisabled}
              answerType={this.props.answerType}
              name={'answerbutton-' + x}
            />
          </Col>
        );
      } else {
        return (
          <Col
            key={x}
            xs={12}
            sm={6}
          >
            <AnswerButton
              primaryText={this.props.alternatives[x][0]}
              secondaryText={this.props.alternatives[x][1] || null}
              japaneseCharacters={this.props.japaneseCharacters}
              onAnswerClick={this.props.clickCallback}
              buttonStyle={this.props.buttonStyles[x]}
              disableButton={this.props.buttonsDisabled}
              answerType={this.props.answerType}
              name={'answerbutton-' + x}
            />
          </Col>
        );
      }
    });
    return (
      <div>
        <Row>{answerButtons}</Row>
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
