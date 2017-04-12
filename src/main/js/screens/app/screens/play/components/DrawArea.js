/*
globals MouseEvent SVG
eslint-disable no-console
*/

import React from 'react';
import simplify from 'simplify-js';
import { Row, Col, Button } from 'react-bootstrap';

import Geometry from '../../../../../shared/util/Geometry';

import Canvas from './Canvas';

export default class DrawArea extends React.Component {
  constructor(props) {
    super(props);

    this.onNewUserPath = this.onNewUserPath.bind(this);

    /* devcode:start */
    // this.onKeys = function (event) {
    //   const keyDown = event.key;
    //   if (keyDown === '0') {
    //     this.mousedown();
    //     setTimeout(() => {
    //       this.setState({
    //         userAnswer: {
    //           ...this.state.userAnswer,
    //           draftPoints: this.state.correctAlternative.pathPoints[this.state.userAnswer.existingPoints.length]
    //         }
    //       }, () => setTimeout(() => { this.mouseup(); }, 100));
    //     }, 200);
    //   }
    // }.bind(this);
    /* devcode:end */

    // Defaults
    this.state = {
      correctAlternative: {
        numberPoints: [], // answerSvgNumberPoints
        pathPoints: [] // answerSvgPoints
      },

      userAnswer: {
        existingPoints: []
      }
    };
  }

  componentDidMount() {
    /* devcode:start */
    // Cheating is fun!
    // window.addEventListener('keydown', this.onKeys);
    /* devcode:end */

    // Get answer svg
    this.prepareAnswerSvg();
  }

  componentWillUnmount() {
    /* devcode:start */
    // window.removeEventListener('keydown', this.onKeys);
    /* devcode:end */
  }

  componentWillUpdate() {
    this.compare();
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

  compare() {
    if (this.state.correctAlternative.pathPoints && this.state.userAnswer.existingPoints.length > 0) {
      const newestUserPointIndex = this.state.userAnswer.existingPoints.length - 1;

      const relevantAnswerPoints = this.state.correctAlternative.pathPoints[newestUserPointIndex];
      const latestUserPoints = this.state.userAnswer.existingPoints[newestUserPointIndex];

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
      .getAngle(latestUserPoints[0], latestUserPoints[newestUserPointIndex]);

      // Get starting angle of correct answer
      const answerStartAngle = Geometry.getAngle(
        relevantAnswerPoints[0],
        relevantAnswerPoints[relevantAnswerPoints.length - 1]
      );

      // Check whether the user started drawing on the correct end of the line
      const correctDirection = (answerStartAngle - 90 < startAngle) && (answerStartAngle + 90 > startAngle);

      // Normalize to percentage values
      const accuracy = parseFloat(match * 100).toFixed(2);
      const totalAccuracy = parseFloat(totalMatch * 100).toFixed(2);

      // Send the comparison upward for current index
      this.props.newMatch({
        lineIndex: newestUserPointIndex,
        accuracy,
        totalAccuracy,
        correctDirection
      });
    }
  }

  getDrawActions() {
    return [
      // Draw the answer kanji lines in the background
      {
        points: {
          answerPoints: this.state.correctAlternative.pathPoints,
          existingPoints: this.state.userAnswer.existingPoints
        },
        action(canvas, actionPoints) {
          const context = canvas.getContext('2d');

          for (let i = 0; i < actionPoints.answerPoints.length; i++) {
            if (i >= actionPoints.existingPoints.length) {
              context.strokeStyle = 'lightgreen';
            } else {
              context.strokeStyle = 'lightgray';
            }
            this.drawPoints(actionPoints.answerPoints[i]);
          }
        }
      },
      // Draw the lines the user has previously made
      {
        points: { existingPoints: this.state.userAnswer.existingPoints },
        action(canvas, actionPoints) {
          const context = canvas.getContext('2d');
          context.strokeStyle = 'darkgreen';

          // Go into each path
          for (let i = 0; i < actionPoints.existingPoints.length; i++) {
            // And iterate each point in it
            // for (let j = 0; j < actionPoints.existingPoints[i].length; j++) {
            this.drawPoints(actionPoints.existingPoints[i]);
            // }
          }
        }
      },
      // Draw the numbers associated with each kanji line, with color logic
      {
        points: {
          numberPoints: this.state.correctAlternative.numberPoints,
          existingPoints: this.state.userAnswer.existingPoints
        },
        action(canvas, actionPoints, drawPoints) {
                // Answer numbers
          if (actionPoints.numberPoints.length > 0) {
            const context = canvas.getContext('2d');

            let offset = 0;
            if (drawPoints.length > 0 && !this.state.isDrawing) {
              offset = 1;
            }

            for (let i = 0; i < actionPoints.numberPoints.length; i++) {
              const currentNumber = parseInt(actionPoints.numberPoints[i].text, 10);
              if (currentNumber === actionPoints.existingPoints.length + 1 + offset) {
                context.fillStyle = 'orange';
              } else if (currentNumber < actionPoints.existingPoints.length + 1 + offset) {
                context.fillStyle = 'lightgray';
              } else {
                context.fillStyle = 'lightgreen';
              }

              this.drawText(actionPoints.numberPoints[i]);
            }
          }
        }
      },
      // Draw the user's unfinished line
      {
        points: {},
        action(canvas, actionPoints, drawPoints) {
          const context = canvas.getContext('2d');
          context.strokeStyle = 'black';

          for (let i = 0; i < drawPoints.length; i++) {
            this.drawPoints(drawPoints);
          }
        }
      }
    ];
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
      />);
  }
}
