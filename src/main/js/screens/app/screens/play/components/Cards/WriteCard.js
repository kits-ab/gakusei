import React from 'react';
import { Row, Col } from 'react-bootstrap';

import DrawArea from '../DrawArea';

const xml2js = require('xml2js');

class WriteCard extends React.Component {
  componentDidMount() {
    this.getSvg();
  }

  getSvg() {
    fetch('/img/kanji/write.svg')
      .then(response => response.text())
      .then((text) => {
        xml2js.parseString(text, (err, result) => {
          this.setState({ svg: result });
        });
      });
  }

  render() {
    return (
      <Row>
        <Col xs={10} xsOffset={1} sm={10} smOffset={1}>
          <Row>
            <object
              fillOpacity="0.0"
              width="12%"
              height="12%"
              viewBox="-7 -85 534 540"
              type="image/svg+xml"
              data="/img/kanji/write.svg"
            >(SVG Fel)</object>
          </Row>
          <Row>
            <DrawArea />
          </Row>
          {/* <Row>
            {this.state && JSON.stringify(this.state.svg)}
          </Row>*/}
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
