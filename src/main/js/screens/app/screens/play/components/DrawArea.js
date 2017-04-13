/*
globals MouseEvent SVG
eslint-disable no-console
*/

import React from 'react';
import simplify from 'simplify-js';

import Geometry from '../../../../../shared/util/Geometry';

import Canvas from './Canvas';

export default class DrawArea extends React.Component {
  constructor(props) {
    super(props);

    this.onNewUserPath = this.onNewUserPath.bind(this);

    /* devcode:start */
    this.onKeys = function (event) {
      const keyDown = event.key;
      if (keyDown === '0') {
        if (!this.props.buttonsDisabled) {
          this.onNewUserPath(this.state.correctAlternative.pathPoints[this.state.userAnswer.existingPoints.length]);
        }
      }
    }.bind(this);
    /* devcode:end */

    // Defaults
    this.defaultState = {
      correctAlternative: {
        numberPoints: [], // answerSvgNumberPoints
        pathPoints: [] // answerSvgPoints
      },

      userAnswer: {
        existingPoints: []
      }
    };
    this.state = this.defaultState;
  }

  componentDidMount() {
    /* devcode:start */
    // Cheating is fun!
    window.addEventListener('keydown', this.onKeys);
    /* devcode:end */

    // Get answer svg
    this.prepareAnswerSvg();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.signToDraw !== this.props.signToDraw) {
      // New sign to draw! Reset state to default
      this.setState(this.defaultState);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.correctAlternative.pathPoints.length === 0 && prevState.correctAlternative.pathPoints.length !== 0) {
      // No answer present, reload it with new answer / svg vector data.
      this.prepareAnswerSvg();
    } else if (prevState.userAnswer.existingPoints.length !== this.state.userAnswer.existingPoints.length) {
      // A new line has been recorded, let's compare.
      this.compare();
    }
  }

  componentWillUnmount() {
    /* devcode:start */
    window.removeEventListener('keydown', this.onKeys);
    /* devcode:end */
  }

  onNewUserPath(points) {
    this.setState({
      userAnswer: {
        ...this.state.userAnswer,
        existingPoints: [
          ...this.state.userAnswer.existingPoints,
          simplify(points, 2, true)
        ]
      }
    });
  }

  getDrawActions() {
    return [
      // Draw the answer kanji lines in the background
      {
        data: {
          answerPoints: this.state.correctAlternative.pathPoints,
          existingPoints: this.state.userAnswer.existingPoints
        },
        action(canvas, data) {
          let lineColor = 'LightGreen';

          for (let i = 0; i < data.answerPoints.length; i++) {
            if (i >= data.existingPoints.length) {
              lineColor = 'LightGreen';
            } else {
              lineColor = 'LightGray';
            }
            this.drawPoints(data.answerPoints[i], lineColor);
          }
        }
      },
      // Draw the lines the user has previously made
      {
        data: {
          existingPoints: this.state.userAnswer.existingPoints,
          highlightErrors: this.props.highlightErrors,
          matches: this.props.matches
        },
        action(canvas, data) {
          // Go into each path
          for (let i = 0; i < data.existingPoints.length; i++) {
            let lineColor = '#505050';
            if (data.highlightErrors) {
              if (!data.matches[i].match.userCorrect) {
                lineColor = 'DarkRed';
              }
            }

            this.drawPoints(data.existingPoints[i], lineColor);
          }
        }
      },
      // Draw the numbers associated with each kanji line, with color logic
      {
        data: {
          numberPoints: this.state.correctAlternative.numberPoints,
          existingPoints: this.state.userAnswer.existingPoints,
          highlightErrors: this.props.highlightErrors,
          matches: this.props.matches
        },
        action(canvas, data) {
          // Answer numbers
          if (data.numberPoints.length > 0) {
            for (let i = 0; i < data.numberPoints.length; i++) {
              let textColor = null;
              let boxColor = null;

              if (data.highlightErrors && !data.matches[i].match.userCorrectDirection) {
                // Error highlighting mode, don't show next number to draw.
                boxColor = 'DarkRed';
              } else {
                const currentNumber = parseInt(data.numberPoints[i].text, 10);
                if (currentNumber === data.existingPoints.length + 1) {
                  boxColor = 'Orange';
                } else if (currentNumber < data.existingPoints.length + 1) {
                  boxColor = null;
                  textColor = 'LightGray';
                  // boxColor = 'LightGray';
                } else {
                  boxColor = null;
                  // boxColor = 'LightGreen';
                }
              }

              this.drawText(data.numberPoints[i], textColor, boxColor);
            }
          }
        }
      },
      // Draw the user's unfinished line
      {
        data: {},
        action(canvas, data, drawPoints) {
          this.drawPoints(drawPoints, 'Black');
        }
      }
    ];
  }

  compare() {
    if (this.state.correctAlternative.pathPoints.length > 0 && this.state.userAnswer.existingPoints.length > 0) {
      const newestUserPointIndex = this.state.userAnswer.existingPoints.length - 1;

      const relevantAnswerPoints = this.state.correctAlternative.pathPoints[newestUserPointIndex];
      const latestUserPoints = this.state.userAnswer.existingPoints[newestUserPointIndex];

      const lessStrict = 20;
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
        this.state.correctAlternative.pathPoints.slice(0, newestUserPointIndex + 1),
        this.state.userAnswer.existingPoints
        , undefined, lessStrict
      );

      if (totalMatch > 0.9) {
        totalMatch = 0.9 + (roundIt(Geometry.compareShapes(
        this.state.correctAlternative.pathPoints.slice(0, newestUserPointIndex + 1),
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

      // Check whether the user started drawing on the correct end of the line
      const userCorrectDirection = (answerStartAngle - 90 < startAngle) && (answerStartAngle + 90 > startAngle);

      // Normalize to percentage values
      const accuracy = parseFloat(match * 100).toFixed(2);
      const totalAccuracy = parseFloat(totalMatch * 100).toFixed(2);

      // Save the comparison

      // Send the comparison upward for current index
      this.props.newMatch({
        lineIndex: newestUserPointIndex,
        linesLeft: this.state.correctAlternative.pathPoints.length - (newestUserPointIndex + 1),
        accuracy,
        totalAccuracy,
        userCorrectDirection
      });
    }
  }

  prepareAnswerSvg() {
    if (this.props.signToDraw) {
      const bounds = this.canvasComponent.canvas.getBoundingClientRect();

      // Convert the character to hex charcode
      const kanjiCharacter = this.props.signToDraw;
      const kanjiHexCharCode = kanjiCharacter.charCodeAt(0).toString(16);
      const svgUrl = `/img/kanji/kanjivg/0${kanjiHexCharCode}.svg`;

      fetch(svgUrl)
        .then(response => response.text())
        .then((text) => {
          const data = Geometry.extractDataFromSVG(text, bounds.width, bounds.height);
          this.setState({
            correctAlternative: {
              pathPoints: data.paths,
              numberPoints: data.numbers
            }
          });
        });
    }
  }

  render() {
    return (
      <Canvas
        ref={(c) => { this.canvasComponent = c; }}
        newUserPath={this.onNewUserPath}
        drawActions={this.getDrawActions()}
        inputDisabled={this.props.buttonsDisabled}
      />);
  }
}

DrawArea.defaultProps = {
  highlightErrors: false
};

DrawArea.propTypes = {
  signToDraw: React.PropTypes.string.isRequired,
  matches: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  highlightErrors: React.PropTypes.bool,
  newMatch: React.PropTypes.func.isRequired,
  buttonsDisabled: React.PropTypes.bool.isRequired
};

