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

    this.handleMouseEvent = this.handleMouseEvent.bind(this);

    /* devcode:start */
    this.onKeys = function (event) {
      const keyDown = event.key;
      if (keyDown === '0') {
        this.mousedown();
        setTimeout(() => {
          this.setState({
            userAnswer: {
              ...this.state.userAnswer,
              draftPoints: this.state.correctAnswer.pathPoints[this.state.userAnswer.existingPoints.length]
            }
          }, () => setTimeout(() => { this.mouseup(); }, 100));
        }, 200);
      }
    }.bind(this);
    /* devcode:end */

    // Useful variables, but shouldn't affect component updates
    this.totalDistance = 0;
    this.distanceThreshhold = 2;
    this.lastSeenAt = { x: null, y: null };
    this.canvasResolutionWidth = 600;
    this.canvasResolutionHeight = 600;

    // Defaults
    this.state = {
      // answerSvgNumberPoints: [], // The numbers displayed in the kanji svg
      // answerSvgPoints: [], // The kanji svg paths
      // userPoints: [],
      // existingUserPoints: [],

      correctAnswer: {
        numberPoints: [], // answerSvgNumberPoints
        pathPoints: [] // answerSvgPoints
      },

      userAnswer: {
        draftPoints: [],
        existingPoints: []
      },

      isDrawing: false,

      accuracy: null,
      totalAccuracy: null
    };
  }

  componentDidMount() {
    /* devcode:start */
    // Cheating is fun!
    window.addEventListener('keydown', this.onKeys);
    /* devcode:end */

    // Get answer svg
    this.prepareAnswerSvg();

    // Configure graphics
    const context = this.canvas.getContext('2d');
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = '#000000';
    context.lineWidth = 10;
    context.font = '28px Helvetica Neue,Helvetica,Arial,sans-serif';

    // Add mouse events
    this.canvas.addEventListener('mousedown', this.handleMouseEvent, false);
    this.canvas.addEventListener('mouseup', this.handleMouseEvent, false);
    this.canvas.addEventListener('mousemove', this.handleMouseEvent, false);

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.canvas.dispatchEvent(mouseEvent);
    }, false);

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      const mouseEvent = new MouseEvent('mouseup', {});
      this.canvas.dispatchEvent(mouseEvent);
    }, false);
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });

      this.canvas.dispatchEvent(mouseEvent);
    }, false);
  }

  componentDidUpdate() {
    if (!this.state.isDrawing && this.state.userAnswer.draftPoints.length > 0) {
      // New line has finished drawing
      this.compare();
    }
  }

  componentWillUnmount() {
    /* devcode:start */
    window.removeEventListener('keydown', this.onKeys);
    /* devcode:end */
    window.removeEventListener('mousedown', this.handleMouseEvent);
    window.removeEventListener('mouseup', this.handleMouseEvent);
    window.removeEventListener('mousemove', this.handleMouseEvent);
  }

  getMousePos(e) {
    const bounds = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top
    };
  }

  prepareAnswerSvg() {
    if (this.props.signToDraw) {
      const bounds = this.canvas.getBoundingClientRect();

      // Convert the character to hex charcode
      const kanjiCharacter = this.props.signToDraw;
      const kanjiHexCharCode = kanjiCharacter.charCodeAt(0).toString(16);
      const svgUrl = `/img/kanji/kanjivg/0${kanjiHexCharCode}.svg`;

      fetch(svgUrl)
        .then(response => response.text())
        .then((text) => {
          const data = Geometry.extractDataFromSVG(text, bounds.width, bounds.height);
          this.setState({
            correctAnswer: {
              pathPoints: data.paths,
              numberPoints: data.numbers
            }
          });
        });
    }
  }

  handleMouseEvent(e) {
    if (this[e.type]) {
      this[e.type](e);
    }
  }

  mousedown() {
    this.totalDistance = 0;

    this.setState({
      isDrawing: true
    });
  }

  mouseup() {
    if (this.state.isDrawing) {
      this.setState({
        userAnswer: {
          ...this.state.userAnswer,
          existingPoints: [...this.state.userAnswer.existingPoints, simplify(this.state.userAnswer.draftPoints, 2, true)]
        },
        isDrawing: false
      });
    }
  }

  mousemove(event) {
    if (this.state.isDrawing) {
      const coords = this.getMousePos(event);

      this.totalDistance += Math.abs(
        this.lastSeenAt.x - coords.x) +
        Math.abs(this.lastSeenAt.y - coords.y
      );

      this.lastSeenAt = coords;

      if (this.totalDistance > this.distanceThreshhold) {
        this.totalDistance = 0;
        this.addPoint(coords.x, coords.y);
      }
    }
  }

  addPoint(x, y) {
    this.setState({
      userAnswer: {
        ...this.state.userAnswer,
        draftPoints: [...this.state.userAnswer.draftPoints, { x, y }]
      }
    });
  }

  drawPoints(points) {
    const context = this.canvas.getContext('2d');
    const bounds = this.canvas.getBoundingClientRect();
    context.beginPath();

    for (let i = 0; i < points.length; i++) {
      const lastX = points[Math.max(i - 1, 0)].x;
      const lastY = points[Math.max(i - 1, 0)].y;
      context.moveTo(
          lastX / (bounds.width / this.canvasResolutionWidth),
          lastY / (bounds.height / this.canvasResolutionHeight)
        );
      context.lineTo(
          points[i].x / (bounds.width / this.canvasResolutionWidth),
          points[i].y / (bounds.height / this.canvasResolutionHeight)
        );
    }
    context.stroke();
  }

  drawTexts(numberPoints) {
    const context = this.canvas.getContext('2d');
    const bounds = this.canvas.getBoundingClientRect();

    for (let i = 0; i < numberPoints.length; i++) {
      let offset = 0;
      if (this.state.userAnswer.draftPoints.length > 0 && !this.state.isDrawing) {
        offset = 1;
      }

      const currentNumber = parseInt(numberPoints[i].text, 10);
      if (currentNumber === this.state.userAnswer.existingPoints.length + 1 + offset) {
        context.fillStyle = 'orange';
      } else if (currentNumber < this.state.userAnswer.existingPoints.length + 1 + offset) {
        context.fillStyle = 'lightgray';
      } else {
        context.fillStyle = 'lightgreen';
      }

      context.fillText(
        numberPoints[i].text,
        numberPoints[i].x / (bounds.width / this.canvasResolutionWidth),
        numberPoints[i].y / (bounds.width / this.canvasResolutionWidth));
    }
  }

  updateCanvas() {
    if (this.canvas) {
      const context = this.canvas.getContext('2d');
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Answer lines
      for (let i = 0; i < this.state.correctAnswer.pathPoints.length; i++) {
        if (i >= this.state.userAnswer.existingPoints.length) {
          context.strokeStyle = 'lightgreen';
        } else {
          context.strokeStyle = 'lightgray';
        }
        this.drawPoints(this.state.correctAnswer.pathPoints[i]);
      }

      // Existing user paths
      context.strokeStyle = 'darkgray';
      for (let i = 0; i < this.state.userAnswer.existingPoints.length; i++) {
        this.drawPoints(this.state.userAnswer.existingPoints[i]);
      }

      // Answer numbers
      if (this.state.correctAnswer.numberPoints.length > 0) {
        this.drawTexts(this.state.correctAnswer.numberPoints);
      }

      // User's current path/line
      if (this.state.userAnswer.draftPoints.length > 0) {
        context.strokeStyle = 'black';
        this.drawPoints(this.state.userAnswer.draftPoints, context);
      }
    }
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
    const canvasStyle = {
      border: '1px solid blue',
      width: '100%',
      height: 'auto'
    };

    this.updateCanvas();

    return (
      <div>
        <Canvas id="drawing" style={canvasStyle} ref={(c) => { this.canvas = c; }} height={this.canvasResolutionHeight} width={this.canvasResolutionWidth} />
        <Row>
          <h2>
            {(this.state.accuracy ? `Accuracy: ${this.state.accuracy}%` : null)}
          </h2>
          <h4>
            {(this.state.accuracy ? `Total Accuracy: ${this.state.totalAccuracy}%` : null)}
          </h4>
          <h4>
            {(this.state.accuracy ? `Correct Starting Position: ${this.state.correctDirection}` : null)}
          </h4>
        </Row>
      </div>);
  }
}
