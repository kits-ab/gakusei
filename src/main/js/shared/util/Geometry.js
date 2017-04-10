import Sketchy from 'moresketchy';

export default class Geometry {
  static extractDataFromSVG(svgText, width = 109, height = 109, pixelsPerPoint = 1) {
    const object = document.createElement('object');
    object.innerHTML = svgText;


    // Get paths
    const paths = object.getElementsByTagName('path');
    const pathArray = [];
    for (let i = 0; i < paths.length; i++) {
      const pathLength = paths[i].getTotalLength();
      const numPoints = (pathLength / pixelsPerPoint) + 1;
      const pathPoints = [];

      for (let j = 0; j < numPoints; j++) {
        const p = paths[i].getPointAtLength((j * pathLength) / numPoints);
        pathPoints.push({
          x: (p.x / 109) * width,
          y: (p.y / 109) * height
        });
      }

      pathArray.push(pathPoints);
    }

    // Get numbers
    const texts = object.getElementsByTagName('text');
    const numberArray = [];
    for (let i = 0; i < texts.length; i++) {
      const matrixData = texts[i].getAttribute('transform').split(' ');
      const numberValue = parseInt(texts[i].textContent, 10);
      const x = (parseInt(matrixData[4], 10) / 109) * width;
      const y = (parseInt(matrixData[5], 10) / 109) * height;

      numberArray.push({ numberValue, x, y });
    }

    return {
      paths: pathArray,
      numbers: numberArray
    };
  }

  static getAngle(startPoint, endPoint) {
    return (Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * 180) / Math.PI;
  }

  static compareShapes(pointPath1, pointPath2, convertToPoints = false) {
    return Sketchy.shapeContextMatch(pointPath1, pointPath2, convertToPoints);
  }
}
