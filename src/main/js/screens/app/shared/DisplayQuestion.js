import React from 'react';
import { Glyphicon, Button } from 'react-bootstrap';
import Speech from '../../../shared/util/Speech';

export class DisplayQuestion extends React.Component {
  getQuestionText() {
    let text = this.props.primaryText || null;

    if (this.props.cardType === 'grammar') {
      return (
        <p className="questionText">
          Ange böjning för
          <br/><strong>{text}</strong><br/>
          på formen
          <br/><strong>testBöjningsForm</strong>
        </p>
      );
    } else if (this.props.secondaryText && this.props.secondaryText !== text) {
      if (this.props.japaneseCharacters) {
        text += ` 「${this.props.secondaryText}」`;
      } else {
        text += ` (${this.props.secondaryText})`;
      }
      return (
        <p className="questionText">{text}</p>
      );
    }


    if (this.props.secondaryText && this.props.secondaryText !== text) {
      if (this.props.japaneseCharacters) {
        text += ` 「${this.props.secondaryText}」`;
      } else {
        text += ` (${this.props.secondaryText})`;
      }
    }

    return text;
  }

  getResource() {
    if (this.props.resourceRef && this.props.resourceRef.type === 'kanjidrawing') {
      return (<object
        fillOpacity="0.0"
        width="12%"
        height="12%"
        viewBox="-7 -85 534 540"
        type="image/svg+xml"
        data={this.props.resourceRef.location}
      >(SVG fel)</object>);
    }
    return (<svg xmlns="http://www.w3.org/2000/svg" fillOpacity="0.0" width="12%" height="12%" viewBox="-7 -85 534 540" />);
  }

  render() {
    const questionText = this.getQuestionText();
    const resource = this.getResource();
    const speechButtonStyle = {
      fontSize: (this.props.smallerText ? '1.0em' : '1.6em'),
      position: 'inherit',
      verticalAlign: 'middle',
      padding: '2px 1px 2px 1px'
    };
    const generalStyle = {
      fontSize: (this.props.smallerText ? '0.5em' : '1.0em')
    };

    return (
      <div style={generalStyle}>
        { this.props.showKanji ? resource : null }
        {questionText}
        <p className="questionText">
          { this.props.japaneseCharacters && this.props.showSpeechButton ?
            <span className="speechButtonContainer">
              {' '}
              <Button bsStyle="info" bsSize="xsmall" onClick={() => Speech.say(this.props.primaryText)} >
                <Glyphicon style={speechButtonStyle} glyph="volume-up" />
              </Button>
            </span>
            :
            null }
        </p>
      </div>
    );
  }
}

DisplayQuestion.defaultProps = {
  resourceRef: null,
  secondaryText: null,
  showSpeechButton: false,
  showKanji: false,
  smallerText: false
};

DisplayQuestion.propTypes = {
  primaryText: React.PropTypes.string.isRequired,
  secondaryText: React.PropTypes.string,
  japaneseCharacters: React.PropTypes.bool.isRequired,
  resourceRef: React.PropTypes.shape({
    type: React.PropTypes.string.isRequired,
    location: React.PropTypes.string.isRequired
  }),
  showSpeechButton: React.PropTypes.bool,
  showKanji: React.PropTypes.bool,
  smallerText: React.PropTypes.bool,
  cardType: React.PropTypes.string,
};

export default DisplayQuestion;
