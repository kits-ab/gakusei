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
    this.distanceThreshhold = 3;
    this.lastSeenAt = { x: null, y: null };
    this.canvasResolutionWidth = 600;
    this.canvasResolutionHeight = 600;

    // Defaults
    this.state = {
      answerKanjiPaths: [],
      points: [],
      comparedPoints: [],
      isDrawing: false,
      accuracy: null,
      totalAccuracy: null,
      resultColor: 'black'
    };
  }

  componentWillMount() {
    this.preparePlaceholderSvg();
  }

  componentDidMount() {
    const context = this.canvas.getContext('2d');
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = '#000000';
    context.lineWidth = 10;

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
    // In case component has been resized
    this.canvasRect = this.canvas.getBoundingClientRect();
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleMouseEvent);
    window.removeEventListener('mouseup', this.handleMouseEvent);
    window.removeEventListener('mousemove', this.handleMouseEvent);
  }

  getMousePos(e) {
    return {
      x: e.clientX - this.canvasRect.left,
      y: e.clientY - this.canvasRect.top
    };
  }

  preparePlaceholderSvg() {
    fetch('/img/kanji/write.svg')
      .then(response => response.text())
      .then((text) => {
        this.svgPointPaths = Geometry.extractPathsFromSVG(text);
      });
  }

  handleMouseEvent(e) {
    if (this[e.type]) {
      this[e.type](e);
    }
  }

  mousedown() {
    this.totalDistance = 0;

    let comparedPoints = [];

    if (this.state.points.length > 0) {
      comparedPoints = [...this.state.comparedPoints, this.state.points];
    }

    this.setState({
      comparedPoints,
      points: [],
      isDrawing: true
    });
  }

  mouseup() {
    if (this.state.isDrawing) {
      this.setState({
        points: simplify(this.state.points, 1, true),
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
    this.setState({ points: [...this.state.points, { x, y }] });
  }

  drawPoints(points) {
    const context = this.canvas.getContext('2d');
    context.beginPath();
    for (let i = 0; i < points.length; i++) {
      const lastX = points[Math.max(i - 1, 0)].x;
      const lastY = points[Math.max(i - 1, 0)].y;
      context.moveTo(
          lastX / (this.canvasRect.height / this.canvasResolutionWidth),
          lastY / (this.canvasRect.height / this.canvasResolutionHeight)
        );
      context.lineTo(
          points[i].x / (this.canvasRect.height / this.canvasResolutionWidth),
          points[i].y / (this.canvasRect.height / this.canvasResolutionHeight)
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
      if (this.state.points.length > 0) {
        this.drawPoints(this.state.points, context);
      }

      // Then draw the answer lines
      if (this.state.answerKanjiPaths.length > 0) {
        this.drawPath(this.state.answerKanjiPaths, context);
      }

      // Draw old user paths
      if (this.state.comparedPoints.length > 0) {
        this.drawPath(this.state.comparedPoints, context);
      }
    }
  }

  compare() {
    if ((this.state.points && this.state.points.length > 1) && (this.svgPointPaths)) {
      const match = Geometry.compareShapes([
        this.svgPointPaths[this.state.answerKanjiPaths.length]
      ], [
        this.state.points
      ]);

      let totalMatch = null;
      if (this.state.comparedPoints.length > 1) {
        totalMatch = Geometry.compareShapes([
          this.svgPointPaths[this.state.answerKanjiPaths.length]
        ], [
          this.state.points, ...this.state.comparedPoints
        ]);
      } else {
        totalMatch = match;
      }

      const accuracy = parseFloat(match * 100).toFixed(2);
      const totalAccuracy = parseFloat(totalMatch * 100).toFixed(2);

      // Extend answer paths
      this.setState({
        answerKanjiPaths: [
          ...this.state.answerKanjiPaths,
          this.svgPointPaths[this.state.answerKanjiPaths.length]
        ],
        accuracy,
        totalAccuracy
      });

      let resultColor;

      if (accuracy > 85) {
        resultColor = 'DarkOliveGreen';
      } else if (accuracy > 65) {
        resultColor = 'DarkGoldenRod ';
      } else if (accuracy > 45) {
        resultColor = 'Chocolate';
      } else if (accuracy > 25) {
        resultColor = 'SaddleBrown';
      } else if (accuracy >= 0) {
        resultColor = 'DarkRed';
      } else {
        resultColor = 'Black';
      }
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
        </Row>
      </div>);
  }
}

export default DrawArea;
