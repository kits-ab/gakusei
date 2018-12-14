import { Col } from 'react-bootstrap';
import AnswerButton from './AnswerButton';
import { translate } from 'react-i18next';

export class FlashButtonSet extends React.Component {
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
        this.props.clickCallback("I don't know");
      }
    }
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <Col
          xs={4}
          xsOffset={2}
          sm={4}
          smOffset={2}
          md={3}
          mdOffset={3}
        >
          <AnswerButton
            answerText={this.props.correctAlternative[0]}
            primaryText={t('cards.yes')}
            onAnswerClick={this.props.clickCallback}
            buttonStyle={'success'}
            buttonSize="small"
            disableButton={this.props.buttonsDisabled}
            answerType={this.props.answerType}
            name="answerbutton-1"
          />
        </Col>
        <Col
          xs={4}
          sm={4}
          md={3}
        >
          <AnswerButton
            answerText={t('dontKnow')}
            primaryText={t('cards.no')}
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

FlashButtonSet.defaultProps = {};

FlashButtonSet.propTypes = {
  correctAlternative: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonsDisabled: PropTypes.bool.isRequired,
  answerType: PropTypes.string.isRequired,
  clickCallback: PropTypes.func.isRequired
};

export default translate('translations')(FlashButtonSet);
