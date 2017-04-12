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
      </div>);
  }
}
