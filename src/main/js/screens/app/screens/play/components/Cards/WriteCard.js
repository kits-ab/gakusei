import React from 'react';
import { Row, Col } from 'react-bootstrap';

import DrawArea from '../DrawArea';
import DisplayQuestion from '../../../../shared/DisplayQuestion';

class WriteCard extends React.Component {
  constructor(props) {
    super(props);

    this.onMatch = this.onMatch.bind(this);

    this.accuracyLevels =
    [
      {
        level: 1,
        minPercent: 0,
        maxPercent: 15,
        acceptable: false,
        wording: 'inte alls bra'
      },
      {
        level: 2,
        minPercent: 15,
        maxPercent: 40,
        acceptable: false,
        wording: 'inte så bra'
      },
      {
        level: 3,
        minPercent: 40,
        maxPercent: 60,
        acceptable: true,
        wording: 'OK'
      },
      {
        level: 4,
        minPercent: 60,
        maxPercent: 90,
        acceptable: true,
        wording: 'bra'
      },
      {
        level: 5,
        minPercent: 90,
        maxPercent: 95,
        acceptable: true,
        wording: 'väldigt bra'
      },
      {
        level: 6,
        minPercent: 95,
        maxPercent: 100,
        acceptable: true,
        wording: 'perfekt'
      }
    ];

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

      this.props.clickCallback(passed, this.state.matches);
    }
  }

  onMatch(match) {
    // Check if this line-match has been recorded already
    if (typeof this.state.matches[match.lineIndex] === 'undefined') {
      let accuracyLevel;
      let totalAccuracyLevel;

      for (let i = 0; i < this.accuracyLevels.length; i++) {
        if (this.accuracyLevels[i].minPercent <= match.accuracy &&
        this.accuracyLevels[i].maxPercent >= match.accuracy) {
          accuracyLevel = this.accuracyLevels[i];
        }

        if (this.accuracyLevels[i].minPercent <= match.totalAccuracy &&
        this.accuracyLevels[i].maxPercent >= match.totalAccuracy) {
          totalAccuracyLevel = this.accuracyLevels[i];
        }
      }

      this.setState({
        matchingDone: match.linesLeft === 0,
        matches: [
          ...this.state.matches, {
            match: {
              percentage: match.accuracy,
              userCorrectDirection: match.userCorrectDirection,
              wording: accuracyLevel.wording,
              scoreLevel: accuracyLevel.level,
              userCorrectDrawStyle: accuracyLevel.acceptable,
              userCorrect: accuracyLevel.acceptable && match.userCorrectDirection
            },
            totalMatch: {
              percentage: match.totalAccuracy,
              wording: totalAccuracyLevel.wording,
              scoreLevel: totalAccuracyLevel.level,
              userCorrect: accuracyLevel.acceptable
            }
          }]
      });

      // No button to end voluntarily for now (should be the only option in harder modes)
    }
  }

  render() {
    return (
      <Row>
        <Col xs={10} xsOffset={1} sm={10} smOffset={1}>
          <Row>
            <DisplayQuestion
              style={{ verticalAlign: 'center' }}
              primaryText={this.props.question.shapes[0]}
              secondaryText={this.props.question.shapes[1] || null}
              japaneseCharacters={false}
            />
          </Row>
          <Row>
            <DrawArea
              signToDraw={this.props.question.correctAlternative[this.props.question.correctAlternative.length - 1]}
              newMatch={this.onMatch}
              matches={this.state.matches}
              highlightErrors={this.state.matchingDone}
              buttonsDisabled={this.props.buttonsDisabled}
            />
          </Row>
        </Col>
      </Row>
    );
  }
}

WriteCard.defaultProps = {

};

WriteCard.propTypes = {
  question: React.PropTypes.shape({
    correctAlternative: React.PropTypes.arrayOf(React.PropTypes.string),
    shapes: React.PropTypes.arrayOf(React.PropTypes.string),
    randomizedAlternatives: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)).isRequired,
    buttonStyles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    resourceRef: React.PropTypes.any
  }).isRequired,
  buttonsDisabled: React.PropTypes.bool.isRequired,
  clickCallback: React.PropTypes.func.isRequired,
  correctAlternative: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
};

export default WriteCard;
