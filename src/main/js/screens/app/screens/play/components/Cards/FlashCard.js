import { Jumbotron, Button, Row, Col } from 'react-bootstrap';
import FlashButtonSet from '../FlashButtonSet';
import DisplayQuestion from '../../../../shared/DisplayQuestion';
import AnswerButton from '../AnswerButton';
import React from 'react';
import { translate } from 'react-i18next';

class FlashCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { flipped: false };

    this.onKeys = this.onKeys.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeys);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.questionAnswered) {
      this.setState({ flipped: false });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeys);
  }

  onKeys(event) {
    if (event.keyCode === 32 /* space */) {
      this.flipIt();
    }
  }

  flipIt() {
    if (!this.props.buttonsDisabled) {
      this.setState({ flipped: !this.state.flipped });
    }
  }

  render() {
    const { t, i18n } = this.props;
    return (
      <Row>
        <Col
          xs={10}
          xsOffset={1}
          sm={10}
          smOffset={1}
        >
          <div className="flip-container">
            <Jumbotron
              className={`flip-container__content${this.state.flipped ? ' flip-container__content--flipped' : ''}`}
            >
              <figure className="flip-container__front">
                <DisplayQuestion
                  style={{ verticalAlign: 'center' }}
                  primaryText={this.props.question.shapes[0]}
                  secondaryText={this.props.question.shapes[1] || null}
                  resourceRef={this.props.question.resourceRef}
                  japaneseCharacters={this.props.questionType === 'reading' && this.props.cardType !== 'quiz'}
                  showSpeechButton
                  showKanji
                />
              </figure>
              <figure className="flip-container__back">
                <DisplayQuestion
                  primaryText={this.props.question.correctAlternative[0]}
                  secondaryText={this.props.question.correctAlternative[1]}
                  resourceRef={this.props.question.resourceRef}
                  japaneseCharacters={this.props.questionType === 'reading' && this.props.cardType !== 'quiz'}
                  showKanji
                />
                {t('cards.flashcard.couldYouAnswer')}
                <FlashButtonSet
                  correctAlternative={this.props.correctAlternative}
                  buttonStyles={this.props.question.buttonStyles}
                  buttonsDisabled={this.props.buttonsDisabled}
                  answerType={this.props.answerType}
                  clickCallback={this.props.clickCallback}
                />
              </figure>
            </Jumbotron>
          </div>
          <br />
          <Row>
            <Button
              className="flipCardButton"
              disabled={this.props.buttonsDisabled}
              bsStyle="primary"
              bsSize="large"
              onClick={() => this.flipIt()}
            >
              &nbsp;
              {t('cards.flashcard.turnCard')}
              &nbsp;
            </Button>
            <div style={{ width: '40%', margin: '5% auto' }}>
              <AnswerButton
                answerText={t('aboutGakusei.finishScreen.dontknow')}
                primaryText={t('aboutGakusei.finishScreen.dontknow')}
                onAnswerClick={this.props.clickCallback}
                buttonStyle={'danger'}
                buttonSize="small"
                disableButton={this.props.buttonsDisabled}
                answerType={this.props.answerType}
                name="dunnobutton"
              />
            </div>
          </Row>
        </Col>
      </Row>
    );
  }
}

FlashCard.defaultProps = {};

FlashCard.propTypes = {
  question: PropTypes.shape({
    correctAlternative: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    shapes: PropTypes.arrayOf(PropTypes.string),
    randomizedAlternatives: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    buttonStyles: PropTypes.arrayOf(PropTypes.string).isRequired,
    resourceRef: PropTypes.string
  }).isRequired,
  buttonsDisabled: PropTypes.bool.isRequired,
  answerType: PropTypes.string.isRequired,
  questionType: PropTypes.string.isRequired,
  clickCallback: PropTypes.func.isRequired,
  cardType: PropTypes.string.isRequired,
  correctAlternative: PropTypes.arrayOf(PropTypes.string).isRequired,
  /* eslint-disable react/no-unused-prop-types */
  questionAnswered: PropTypes.bool.isRequired
};

export default translate('translations')(FlashCard);
