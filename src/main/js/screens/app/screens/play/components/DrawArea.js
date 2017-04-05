/*
globals MouseEvent
eslint-disable no-console
*/

import React from 'react';

import simplify from 'simplify-js';

export class DrawArea extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseEvent = this.handleMouseEvent.bind(this);

    this.totalDistance = 0;
    this.lastSeenAt = { x: null, y: null };

    this.canvasResolutionWidth = 600;
    this.canvasResolutionHeight = 600;

    this.state = {
      isDrawing: false
    };
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

    this.updateCanvas();
  }

  componentDidUpdate() {
    this.canvasRect = this.canvas.getBoundingClientRect();
    this.updateCanvas();
  }

  componentWillUnmount() {
    // TODO: Remove listeners
  }

  getMousePos(e) {
    return {
      x: e.clientX - this.canvasRect.left,
      y: e.clientY - this.canvasRect.top
    };
  }

  mousedown() {
    this.totalDistance = 0;
    this.points = [];
    this.setState({ isDrawing: true });
  }

  mouseup() {
    if (this.state.isDrawing) {
      this.simplifyPoints();
      this.setState({ isDrawing: false });
    }
  }

  mousemove(event) {
    if (this.state.isDrawing) {
      console.log('mousemove');
      const coords = this.getMousePos(event);
      this.totalDistance += Math.abs(this.lastSeenAt.x - coords.x) + Math.abs(this.lastSeenAt.y - coords.y);
      this.lastSeenAt = coords;

      if (this.totalDistance > 5) {
        this.totalDistance = 0;
        this.addPoint(coords.x, coords.y);
        this.updateCanvas();
      }
    }
  }

  handleMouseEvent(e) {
    if (this[e.type]) {
      this[e.type](e);
    }
  }

  addPoint(xPos, yPos) {
    this.points.push({ x: xPos, y: yPos });
  }

  simplifyPoints() {
    const newPoints = simplify(this.points, 2, true);
    this.points = newPoints;
  }

  clearPoints() {
    this.points = [];
  }

  clearCanvas() {
    const context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updateCanvas() {
    this.clearCanvas();
    const context = this.canvas.getContext('2d');

    if (this.points && this.points.length > 0) {
      context.beginPath();
      for (let i = 0; i < this.points.length; i++) {
        const lastX = this.points[Math.max(i - 1, 0)].x;
        const lastY = this.points[Math.max(i - 1, 0)].y;
        context.moveTo(
          lastX / (this.canvasRect.height / this.canvasResolutionWidth),
          lastY / (this.canvasRect.height / this.canvasResolutionHeight)
        );
        context.lineTo(
          this.points[i].x / (this.canvasRect.height / this.canvasResolutionWidth),
          this.points[i].y / (this.canvasRect.height / this.canvasResolutionHeight)
        );
      }
      context.stroke();
    }
  }

  render() {
    const canvasStyle = {
      border: '1px solid blue',
      width: '100%',
      height: 'auto'
    };

    return (
      <canvas id="drawing" style={canvasStyle} ref={(c) => { this.canvas = c; }} height={this.canvasResolutionHeight} width={this.canvasResolutionWidth} />
    );
  }
}

export default DrawArea;
