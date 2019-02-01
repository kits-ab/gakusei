import { Row, Col } from 'react-bootstrap';

import DrawArea from '../DrawArea';
import FlashButtonSet from '../FlashButtonSet';
import React from 'react';
import DisplayQuestion from '../../../../shared/DisplayQuestion';
import AnswerButton from '../AnswerButton';
import { translate } from 'react-i18next';

class WriteCard extends React.Component {
  constructor(props) {
    super(props);

    this.onMatch = this.onMatch.bind(this);

    this.defaultState = {
      matchingDone: false,
      matches: []
    };

    this.state = this.defaultState;
  }

  componentWillReceiveProps(nextProps) {
    const lastShapeIndex = this.props.question.shapes.length - 1;

    if (nextProps.question.shapes[lastShapeIndex] !== this.props.question.shapes[lastShapeIndex]) {
      // New sign to draw!
      this.setState(this.defaultState);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.matchingDone && this.state.matchingDone) {
      // Only call this when we have the entire sign
      const passed = this.state.matches.every(matchObj => matchObj.match.userCorrect);
      //this.props.clickCallback(passed, this.state.matches);
    }
  }

  onMatch(match) {
    // Check if this line-match has been recorded already
    if (typeof this.state.matches[match.lineIndex] === 'undefined') {
      this.setState({
        matchingDone: match.linesLeft === 0,
        matches: [
          ...this.state.matches,
          {
            match: {
              userCorrect: match.validationResults.every(result => result.value === true)
            },
            totalMatch: {
              userCorrect: match.validationResults.every(result => result.value === true)
            }
          }
        ]
      });

      // No button to end voluntarily for now (should be the only option in harder modes)
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
          <Row>
            <DisplayQuestion
              style={{ verticalAlign: 'center' }}
              primaryText={this.props.question.shapes[0]}
              secondaryText={!['hard'].includes(this.props.difficulty) ? this.props.question.shapes[1] || null : null}
              tertiaryText={this.props.question.shapes[2]}
              japaneseCharacters={false}
            />
          </Row>
          <Row>
            <DrawArea
              vetEj={this.props.vetEj}
              signToDraw={this.props.correctAlternative[this.props.correctAlternative.length - 1]}
              newMatch={this.onMatch}
              matches={this.state.matches}
              highlightErrors={false}
              buttonsDisabled={this.props.buttonsDisabled || this.state.matchingDone}
              difficulty={this.props.difficulty}
              canvasUrlCallback={this.props.canvasUrlCallback}
            />
          </Row>
          <Row>
            {this.state.matchingDone ? (
              <React.Fragment>
                {t('cards.writecard.writeCorrectly')}
                <FlashButtonSet
                  correctAlternative={this.props.correctAlternative}
                  buttonStyles={this.props.question.buttonStyles}
                  buttonsDisabled={this.props.buttonsDisabled}
                  answerType={this.props.answerType}
                  clickCallback={this.props.clickCallback}
                />
              </React.Fragment>
            ) : (
              <div style={{ width: '40%', margin: '0% auto' }}>
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
            )}
          </Row>
        </Col>
      </Row>
    );
  }
}

WriteCard.defaultProps = {};

WriteCard.propTypes = {
  question: PropTypes.shape({
    correctAlternative: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    shapes: PropTypes.arrayOf(PropTypes.string),
    randomizedAlternatives: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    buttonStyles: PropTypes.arrayOf(PropTypes.string).isRequired,
    resourceRef: PropTypes.any
  }).isRequired,
  buttonsDisabled: PropTypes.bool.isRequired,
  clickCallback: PropTypes.func.isRequired,
  correctAlternative: PropTypes.arrayOf(PropTypes.string).isRequired,
  difficulty: PropTypes.string.isRequired
};

export default translate('translations')(WriteCard);
