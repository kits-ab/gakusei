import React from 'react';
import { Jumbotron, Button, Grid, Row, Col } from 'react-bootstrap';
import FlashButtonSet from './FlashButtonSet';
import DisplayQuestion from '../../../shared/DisplayQuestion';
import devOnly from '../../../../../shared/util/devOnly';

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
    return (
      <Row>
        <Col xs={10} xsOffset={1} sm={10} smOffset={1}>
          <div className="flip-container">
            <Jumbotron className={`card${this.state.flipped ? ' flipped' : ''}`}>
              <figure className="front">
                <DisplayQuestion
                  style={{ verticalAlign: 'center' }}
                  primaryText={this.props.question.actualQuestionShapes[0]}
                  secondaryText={this.props.question.actualQuestionShapes[1] || null}
                  resourceRef={this.props.question.resourceRef}
                  japaneseCharacters={this.props.questionType === 'reading' && this.props.cardType !== 'quiz'}
                  showSpeechButton
                  showKanji
                />
              </figure>
              <figure className="back">
                <DisplayQuestion
                  primaryText={this.props.question.correctAlternative[0]}
                  secondaryText={this.props.question.correctAlternative[1]}
                  resourceRef={this.props.question.resourceRef}
                  japaneseCharacters={this.props.questionType === 'reading' && this.props.cardType !== 'quiz'}
                  showKanji
                />
                <i>Kunde du svaret?</i>
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
            &nbsp;Vänd på kortet&nbsp;
            </Button>
          </Row>
        </Col>
      </Row>
    );
  }
}

FlashCard.defaultProps = {

};

FlashCard.propTypes = {
  question: React.PropTypes.shape({
    correctAlternative: React.PropTypes.arrayOf(React.PropTypes.string),
    actualQuestionShapes: React.PropTypes.arrayOf(React.PropTypes.string),
    randomizedAlternatives: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)).isRequired,
    buttonStyles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    resourceRef: React.PropTypes.string
  }).isRequired,
  buttonsDisabled: React.PropTypes.bool.isRequired,
  answerType: React.PropTypes.string.isRequired,
  questionType: React.PropTypes.string.isRequired,
  clickCallback: React.PropTypes.func.isRequired,
  cardType: React.PropTypes.string.isRequired,
  correctAlternative: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  questionAnswered: React.PropTypes.bool.isRequired,
  questionAnsweredCorrectly: React.PropTypes.bool.isRequired
};

export default FlashCard;
