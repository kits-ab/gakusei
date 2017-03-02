import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import Speech from '../../../shared/util/Speech';

export class DisplayQuestion extends React.Component {
  getQuestionText() {
    let text = this.props.primaryText || null;

    if (this.props.secondaryText && this.props.secondaryText !== this.props.primaryText) {
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
    return (
      <div>
        <div>{this.getResource()}</div>
        <div>
          <p className="questionText">
            {questionText}
            { this.props.japaneseCharacters ?
              <small>
                <small>
                  <Glyphicon glyph="volume-up" onClick={() => Speech.say(this.props.primaryText)} />
                </small>
              </small>
            :
            null }
          </p>
        </div>
      </div>
    );
  }
}

DisplayQuestion.defaultProps = {
  resourceRef: null,
  secondaryText: null
};

DisplayQuestion.propTypes = {
  primaryText: React.PropTypes.string.isRequired,
  secondaryText: React.PropTypes.string,
  japaneseCharacters: React.PropTypes.bool.isRequired,
  resourceRef: React.PropTypes.string
};

export default DisplayQuestion;
