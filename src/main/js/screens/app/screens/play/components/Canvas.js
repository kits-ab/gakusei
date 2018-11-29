/* globals MouseEvent */
/* eslint-disable no-console */

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseEvent = this.handleMouseEvent.bind(this);

    this.canvasResolutionWidth = 600;
    this.canvasResolutionHeight = 600;
    this.totalDistance = 0;
    this.distanceThreshhold = 2;
    this.lastSeenAt = { x: null, y: null };

    this.fontSize = '28px';
    this.fontFamily = 'Helvetica Neue,Helvetica,Arial,sans-serif';

    this.defaultState = {
      isMouseDown: false,
      isDrawing: false,
      points: []
    };

    this.state = this.defaultState;
  }

  componentDidMount() {
    // Configure graphics
    const context = this.canvas.getContext('2d');
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = '#000000';
    context.lineWidth = 10;
    context.font = `${this.fontSize} ${this.fontFamily}`;

    // Add mouse events
    this.canvas.addEventListener('mousedown', this.handleMouseEvent, false);
    this.canvas.addEventListener('mouseup', this.handleMouseEvent, false);
    this.canvas.addEventListener('mousemove', this.handleMouseEvent, false);

    this.canvas.addEventListener(
      'touchstart',
      e => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
          button: 0,
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
      },
      false
    );

    this.canvas.addEventListener(
      'touchend',
      e => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        this.canvas.dispatchEvent(mouseEvent);
      },
      false
    );
    this.canvas.addEventListener(
      'touchmove',
      e => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });

        this.canvas.dispatchEvent(mouseEvent);
      },
      false
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    // TODO: Still getting 2 draw events despite the below..
    if (this.props.drawActions === nextProps.drawActions) {
      if (this.state.points === nextState.points) {
        return false;
      }
    }

    return true;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.inputDisabled && !this.props.inputDisabled) {
      // Input was disabled, make sure to reset inputs
      this.totalDistance = 0;
      this.lastSeenAt = { x: null, y: null };

      this.setState(this.defaultState);
    }
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
    if (e.button === 0) {
      if (this[e.type]) {
        this[e.type](e);
      }
    }
  }

  mousedown() {
    if (!this.props.inputDisabled && !this.state.isDrawing) {
      this.totalDistance = 0;

      this.setState({
        isMouseDown: true
      });
    }
  }

  mouseup() {
    if (!this.props.inputDisabled && this.state.isDrawing) {
      this.props.newUserPath(this.state.points);
      this.setState({
        isMouseDown: false,
        isDrawing: false,
        points: []
      });
    } else {
      this.setState({
        isMouseDown: false,
        points: []
      });
    }
  }

  mousemove(event) {
    if (!this.props.inputDisabled && this.state.isMouseDown) {
      const coords = this.getMousePos(event);

      this.totalDistance += Math.abs(this.lastSeenAt.x - coords.x) + Math.abs(this.lastSeenAt.y - coords.y);

      this.lastSeenAt = coords;

      if (this.totalDistance > this.distanceThreshhold) {
        this.totalDistance = 0;

        // We are now drawing a line.
        this.setState({
          isDrawing: this.state.points.length > 1,
          points: [...this.state.points, { x: coords.x, y: coords.y }]
        });
      }
    }
  }

  drawPoints(points, lineColor, linewidth) {
    const context = this.canvas.getContext('2d');
    const bounds = this.canvas.getBoundingClientRect();

    if (lineColor) {
      context.strokeStyle = lineColor;
      context.lineWidth = linewidth;
    } else {
      context.strokeStyle = 'Black';
    }

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

  drawText(textPoint, textColor, boxColor) {
    const context = this.canvas.getContext('2d');
    const bounds = this.canvas.getBoundingClientRect();

    const fontSizeMod = parseInt(this.fontSize, 10) / 1.7;
    const charCount = textPoint.text.toString().length;
    const xMod = charCount * fontSizeMod;

    // 8px is good for 2+ characters
    // 16px gives a nice square if only 1 character
    let boxPadding = 8;
    if (charCount === 1) {
      boxPadding = 16;
    }

    context.globalAlpha = 0.5;
    if (boxColor) {
      context.fillStyle = boxColor;
      context.fillRect(
        parseInt(textPoint.x / (bounds.width / this.canvasResolutionWidth) - boxPadding / 2, 10),
        parseInt(textPoint.y / (bounds.height / this.canvasResolutionHeight) - 25, 10),
        parseInt(xMod + boxPadding, 10),
        parseInt(32, 10)
      );
    }

    context.globalAlpha = 1.0;
    if (textColor) {
      context.fillStyle = textColor;
    } else {
      context.fillStyle = 'Black';
    }

    context.fillText(
      textPoint.text,
      textPoint.x / (bounds.width / this.canvasResolutionWidth),
      textPoint.y / (bounds.height / this.canvasResolutionHeight)
    );
  }

  updateCanvas() {
    if (this.canvas) {
      // Clear the canvas
      const context = this.canvas.getContext('2d');
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw the canvas
      for (let i = 0; i < this.props.drawActions.length; i++) {
        const data = this.props.drawActions[i].data;

        this.props.drawActions[i].action.call(this, this.canvas, data, this.state.points);
      }
    }
  }

  render() {
    const canvasStyle = {
      border: '1px solid black',
      width: '100%',
      height: 'auto'
    };

    this.updateCanvas();

    return (
      <div>
        <canvas
          id="drawing"
          style={canvasStyle}
          ref={c => {
            this.canvas = c;
          }}
          height={this.canvasResolutionHeight}
          width={this.canvasResolutionWidth}
        />
      </div>
    );
  }
}

Canvas.defaultProps = {
  inputDisabled: false,
  drawActions: []
};

Canvas.propTypes = {
  inputDisabled: PropTypes.bool,
  newUserPath: PropTypes.func.isRequired,
  drawActions: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.object.isRequired,
      action: PropTypes.func.isRequired
    }).isRequired
  )
};
