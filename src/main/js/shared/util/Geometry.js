import Sketchy from 'moresketchy';

export default class Geometry {
  static extractPathsFromSVG(svgText, pixelsPerPoint = 1) {
    const svgObject = document.createElement('svg');
    svgObject.innerHTML = svgText;

    const paths = svgObject.getElementsByTagName('path'); // document.getElementById('mypath');
    const pathArray = [];

    for (let i = 0; i < paths.length; i++) {
      const pathLength = paths[i].getTotalLength();
      const numPoints = (pathLength / pixelsPerPoint) + 1;
      const pathPoints = [];

      for (let j = 0; j < numPoints; j++) {
        const p = paths[i].getPointAtLength((j * pathLength) / numPoints);
        pathPoints.push({ x: p.x, y: p.y });
      }

      pathArray.push(pathPoints);
    }

    return pathArray;
  }

  static getAngle(startPoint, endPoint) {
    return (Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * 180) / Math.PI;
  }

  static compareShapes(pointPath1, pointPath2, convertToPoints = false) {
    return Sketchy.shapeContextMatch(pointPath1, pointPath2, convertToPoints);
  }
}
