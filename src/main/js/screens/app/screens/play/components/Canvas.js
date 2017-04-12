/*
globals MouseEvent SVG
eslint-disable no-console
*/

import React from 'react';
import simplify from 'simplify-js';
import { Row, Col, Button } from 'react-bootstrap';

import Geometry from '../../../../../shared/util/Geometry';

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseEvent = this.handleMouseEvent.bind(this);

    this.canvasResolutionWidth = 600;
    this.canvasResolutionHeight = 600;
    this.totalDistance = 0;
    this.distanceThreshhold = 2;
    this.lastSeenAt = { x: null, y: null };

    this.state = {
      isDrawing: false,

      points: []
    };
  }

  componentDidMount() {
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
      this.props.newUserPath(this.state.points);

      this.setState({
        isDrawing: false,
        points: []
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
      points: [...this.state.points, { x, y }]
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


  drawText(textPoint) {
    const context = this.canvas.getContext('2d');
    const bounds = this.canvas.getBoundingClientRect();

    context.fillText(
      textPoint.text,
      textPoint.x / (bounds.width / this.canvasResolutionWidth),
      textPoint.y / (bounds.width / this.canvasResolutionWidth)
    );
  }

  updateCanvas() {
    if (this.canvas) {
      // Clear the canvas
      const context = this.canvas.getContext('2d');
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw the canvas
      for (let i = 0; i < this.props.drawActions.length; i++) {
        const actionPoints = this.props.drawActions[i].points;

        this.props.drawActions[i].action.call(this, this.canvas, actionPoints, this.state.points);
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
      </div>
    );
  }
}
