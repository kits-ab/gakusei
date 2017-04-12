import React from 'react';
import { Row, Col } from 'react-bootstrap';

import Geometry from '../../../../../../shared/util/Geometry';
import DrawArea from '../DrawArea';

class WriteCard extends React.Component {
  constructor(props) {
    super(props);

    this.onMatch = this.onMatch.bind(this);

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

// accuracyLevels={
//               [
//                 {
//                   level: 1,
//                   minPercent: 0,
//                   maxPercent: 15,
//                   acceptable: false,
//                   wording: 'Inte ens nära'
//                 },
//                 {
//                   level: 2,
//                   minPercent: 15,
//                   maxPercent: 40,
//                   acceptable: false,
//                   wording: 'Ej godkänt'
//                 },
//                 {
//                   level: 3,
//                   minPercent: 40,
//                   maxPercent: 60,
//                   wording: 'OK'
//                 },
//                 {
//                   level: 4,
//                   minPercent: 60,
//                   maxPercent: 80,
//                   wording: 'Bra'
//                 },
//                 {
//                   level: 5,
//                   minPercent: 80,
//                   maxPercent: 90,
//                   wording: 'Mycket Bra'
//                 },
//                 {
//                   level: 6,
//                   minPercent: 90,
//                   maxPercent: 100,
//                   wording: 'Perfekt'
//                 }
//               ]}

  onMatch(data) {
    // lineIndex: newestUserPointIndex,
    // accuracy,
    // totalAccuracy,
    // correctDirection
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
              signToDraw={this.props.question.shapes[this.props.question.shapes.length - 1]}
              newMatch={this.onMatch}
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
  answerType: React.PropTypes.string.isRequired,
  questionType: React.PropTypes.string.isRequired,
  clickCallback: React.PropTypes.func.isRequired,
  cardType: React.PropTypes.string.isRequired,
  correctAlternative: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  questionAnswered: React.PropTypes.bool.isRequired,
  questionAnsweredCorrectly: React.PropTypes.bool.isRequired
};

export default WriteCard;
