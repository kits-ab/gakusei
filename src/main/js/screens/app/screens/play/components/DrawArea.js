/*
globals MouseEvent SVG
eslint-disable no-console
*/

import React from 'react';
import simplify from 'simplify-js';
import { Row, Col, Button } from 'react-bootstrap';

import Geometry from '../../../../../shared/util/Geometry';

export class DrawArea extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseEvent = this.handleMouseEvent.bind(this);

    // Useful variables, but shouldn't affect component updates
    this.totalDistance = 0;
    this.distanceThreshhold = 5;
    this.lastSeenAt = { x: null, y: null };
    this.canvasResolutionWidth = 600;
    this.canvasResolutionHeight = 600;

    // Defaults
    this.state = {
      shownAnswerSvgPoints: [],
      answerSvgNumberPoints: [], // The numbers displayed in the kanji svg
      answerSvgPoints: [], // The kanji svg paths
      userPoints: [],
      existingUserPoints: [],

      isDrawing: false,

      accuracy: null,
      totalAccuracy: null,
      resultColor: 'black'
    };
  }

  componentDidMount() {
    // Get answer svg
    this.prepareAnswerSvg();

    // Configure graphics
    const context = this.canvas.getContext('2d');
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = '#000000';
    context.lineWidth = 10;

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

  componentWillUnmount() {
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
    if (this.props.question.actualQuestionShapes.length > 0) {
      const bounds = this.canvas.getBoundingClientRect();

      const kanjiCharacter = this.props.question.actualQuestionShapes[this.props.question.actualQuestionShapes.length - 1];
      const kanjiHexCharCode = kanjiCharacter.charCodeAt(0).toString(16);
      const svgUrl = `/img/kanji/kanjivg/0${kanjiHexCharCode}.svg`;

      fetch(svgUrl)
        .then(response => response.text())
        .then((text) => {
          const data = Geometry.extractDataFromSVG(text, bounds.width, bounds.height);
          this.setState({
            answerSvgPoints: data.paths,
            answerSvgNumberPoints: data.numbers
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

    let existingUserPoints = [];

    if (this.state.userPoints.length > 0) {
      existingUserPoints = [...this.state.existingUserPoints, this.state.userPoints];
    }

    this.setState({
      existingUserPoints,
      userPoints: [],
      isDrawing: true
    });
  }

  mouseup() {
    if (this.state.isDrawing) {
      this.setState({
        userPoints: simplify(this.state.userPoints, 2, true),
        isDrawing: false
      }, this.compare());
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
    this.setState({ userPoints: [...this.state.userPoints, { x, y }] });
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

  drawPath(path) {
    for (let i = 0; i < path.length; i++) {
      this.drawPoints(path[i]);
    }
  }

  updateCanvas() {
    if (this.canvas) {
      const context = this.canvas.getContext('2d');
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // context.strokeStyle = this.state.resultColor;

      // Draw the user's current path/line
      if (this.state.userPoints.length > 0) {
        this.drawPoints(this.state.userPoints, context);
      }

      // Then draw the corner answer lines
      if (this.state.shownAnswerSvgPoints.length > 0) {
        this.drawPath(this.state.shownAnswerSvgPoints, context);
      }

      // Then draw the answer lines
      if (this.state.answerSvgPoints.length > 0) {
        this.drawPath(this.state.answerSvgPoints, context);
      }

      // Draw old user paths
      if (this.state.existingUserPoints.length > 0) {
        this.drawPath(this.state.existingUserPoints, context);
      }
    }
  }

  compare() {
    if ((this.state.userPoints && this.state.userPoints.length > 1) && (this.state.answerSvgPoints)) {
      // Calculate accuracy for this shape
      const match = Geometry.compareShapes([
        this.state.answerSvgPoints[this.state.shownAnswerSvgPoints.length]
      ], [
        this.state.userPoints
      ]);

      // Calculate accuracy for total shapes
      let totalMatch = null;
      if (this.state.existingUserPoints.length > 1) {
        totalMatch = Geometry.compareShapes([
          this.state.answerSvgPoints[this.state.shownAnswerSvgPoints.length]
        ], [
          this.state.userPoints, ...this.state.existingUserPoints
        ]);
      } else {
        totalMatch = match;
      }

      // Get starting angle of drawn path
      const startAngle = Geometry.getAngle(this.state.userPoints[0], this.state.userPoints[this.state.userPoints.length - 1]);

      // Get starting angle of correct answer
      const answerStartAngle = Geometry.getAngle(
        this.state.answerSvgPoints[this.state.shownAnswerSvgPoints.length][0],
        this.state.answerSvgPoints[this.state.shownAnswerSvgPoints.length][this.state.answerSvgPoints[this.state.shownAnswerSvgPoints.length].length - 1]
      );

      const correctDirection = (answerStartAngle - 90 < startAngle) && (answerStartAngle + 90 > startAngle);

      // Normalize
      const accuracy = parseFloat(match * 100).toFixed(2);
      const totalAccuracy = parseFloat(totalMatch * 100).toFixed(2);

      // Extend answer paths
      this.setState({
        shownAnswerSvgPoints: [
          ...this.state.shownAnswerSvgPoints,
          this.state.answerSvgPoints[this.state.shownAnswerSvgPoints.length]
        ],
        accuracy,
        totalAccuracy,
        correctDirection
      });

      // let resultColor;

      // if (accuracy > 85) {
      //   resultColor = 'DarkOliveGreen';
      // } else if (accuracy > 65) {
      //   resultColor = 'DarkGoldenRod ';
      // } else if (accuracy > 45) {
      //   resultColor = 'Chocolate';
      // } else if (accuracy > 25) {
      //   resultColor = 'SaddleBrown';
      // } else if (accuracy >= 0) {
      //   resultColor = 'DarkRed';
      // } else {
      //   resultColor = 'Black';
      // }
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
        <canvas id="drawing" style={canvasStyle} ref={(c) => { this.canvas = c; }} height={this.canvasResolutionHeight} width={this.canvasResolutionWidth} />
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

export default DrawArea;
