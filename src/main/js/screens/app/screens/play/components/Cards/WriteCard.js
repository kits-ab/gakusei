import React from 'react';
import { Row, Col } from 'react-bootstrap';

import Geometry from '../../../../../../shared/util/Geometry';
import DrawArea from '../DrawArea';

class WriteCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      matchRecords: {
        percentage: [],
        wording: [],
        scoreLevel: []
      },
      totalMatchRecords: {
        percentage: [],
        wording: [],
        scoreLevel: []
      }
    };
  }

  compare() {
    if (!this.isDrawing && this.state.correctAnswer.pathPoints && this.state.userAnswer.draftPoints.length > 0) {
      const relevantAnswerPoints = this.state.correctAnswer.pathPoints[this.state.userAnswer.existingPoints.length - 1];
      const latestUserPoints = this.state.userAnswer.existingPoints[this.state.userAnswer.existingPoints.length - 1];

      const lessStrict = 10;
      const veryStrict = 50;

      const roundIt = (value, decimals) => Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);

      // Calculate accuracy for this shape
      let match = Geometry.compareShapes([relevantAnswerPoints], [latestUserPoints], undefined, lessStrict);
      if (match > 0.9) {
        match = 0.9 + (roundIt(
          Geometry.compareShapes([relevantAnswerPoints], [latestUserPoints], undefined, veryStrict), 2) - 0.9);
      }

      // Calculate accuracy for total shapes
      let totalMatch = Geometry.compareShapes(
        this.state.correctAnswer.pathPoints.slice(0, this.state.userAnswer.existingPoints.length),
        this.state.userAnswer.existingPoints
        , undefined, lessStrict
      );

      if (totalMatch > 0.9) {
        totalMatch = 0.9 + (roundIt(Geometry.compareShapes(
        this.state.correctAnswer.pathPoints.slice(0, this.state.userAnswer.existingPoints.length),
        this.state.userAnswer.existingPoints
        , undefined, veryStrict
      ), 2) - 0.9);
      }

      // Get starting angle of drawn path
      const startAngle = Geometry
      .getAngle(latestUserPoints[0], latestUserPoints[latestUserPoints.length - 1]);

      // Get starting angle of correct answer
      const answerStartAngle = Geometry.getAngle(
        relevantAnswerPoints[0],
        relevantAnswerPoints[relevantAnswerPoints.length - 1]
      );

      const correctDirection = (answerStartAngle - 90 < startAngle) && (answerStartAngle + 90 > startAngle);

      // Normalize to percentage values
      const accuracy = parseFloat(match * 100).toFixed(2);
      const totalAccuracy = parseFloat(totalMatch * 100).toFixed(2);

      // Extend answer paths
      this.setState({
        userAnswer: {
          ...this.state.userAnswer,
          draftPoints: []
        },
        accuracy,
        totalAccuracy,
        correctDirection
      });
    }
  }

  render() {
    return (
      <Row>
        <Col xs={10} xsOffset={1} sm={10} smOffset={1}>
          {/* <Row>
            <object
              fillOpacity="0.0"
              width="50%"
              height="50%"
              viewBox="-7 -85 534 540"
              type="image/svg+xml"
              data="/img/kanji/write.svg"
            >(SVG Fel)</object>
          </Row>*/}
          {/* <Row>
            Rita ovan objekt
          </Row>*/}
          <Row>
            <DrawArea
              signToDraw={this.props.question.actualQuestionShapes[this.props.question.actualQuestionShapes.length - 1]}
              accuracyLevels={
              [
                {
                  level: 1,
                  minPercent: 0,
                  maxPercent: 15,
                  acceptable: false,
                  wording: 'Inte ens nära'
                },
                {
                  level: 2,
                  minPercent: 15,
                  maxPercent: 40,
                  acceptable: false,
                  wording: 'Ej godkänt'
                },
                {
                  level: 3,
                  minPercent: 40,
                  maxPercent: 60,
                  wording: 'OK'
                },
                {
                  level: 4,
                  minPercent: 60,
                  maxPercent: 80,
                  wording: 'Bra'
                },
                {
                  level: 5,
                  minPercent: 80,
                  maxPercent: 90,
                  wording: 'Mycket Bra'
                },
                {
                  level: 6,
                  minPercent: 90,
                  maxPercent: 100,
                  wording: 'Perfekt'
                }
              ]}
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
    actualQuestionShapes: React.PropTypes.arrayOf(React.PropTypes.string),
    randomizedAlternatives: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)).isRequired,
    buttonStyles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    resourceRef: React.PropTypes.any
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

export default WriteCard;
