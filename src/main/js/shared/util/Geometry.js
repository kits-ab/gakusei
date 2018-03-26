import Sketchy from 'moresketchy';
import mathjs from 'mathjs';

export default class Geometry {
  static extractDataFromSVG(svgText, width = 109, height = 109, pixelsPerPoint = 1) {
    const object = document.createElement('object');
    object.innerHTML = svgText;

    // Get paths
    const paths = object.getElementsByTagName('path');
    const pathArray = [];
    for (let i = 0; i < paths.length; i++) {
      const pathLength = paths[i].getTotalLength();
      const numPoints = pathLength / pixelsPerPoint + 1;
      const pathPoints = [];

      for (let j = 0; j < numPoints; j++) {
        const p = paths[i].getPointAtLength(j * pathLength / numPoints);
        pathPoints.push({
          x: p.x / 109 * width,
          y: p.y / 109 * height
        });
      }

      pathArray.push(pathPoints);
    }

    // Get numbers
    const texts = object.getElementsByTagName('text');
    const numberArray = [];
    for (let k = 0; k < texts.length; k++) {
      // matrix(1 0 0 1 20.25 13.63)
      const xyMatches = texts[k]
        .getAttribute('transform')
        .match(/matrix\([(\d\s)]{8}([^(\s)]*)\s([^(\s)]*)\)/)
        .slice(1);
      const text = parseInt(texts[k].textContent, 10);
      const x = parseInt(parseFloat(xyMatches[0]) / 109 * width, 10);
      const y = parseInt(parseFloat(xyMatches[1]) / 109 * height, 10);

      numberArray.push({ text, x, y });
    }

    return {
      paths: pathArray,
      numbers: numberArray
    };
  }

  static getIntersections(pointPath1, pointPath2) {
    const intersections = [];

    const coordsAsArr = coordsObj => [coordsObj.x, coordsObj.y];
    const coordsAsObj = coordsArr => ({ x: coordsArr[0], y: coordsArr[1] });

    pointPath2.forEach((rootCoords, rootIndex, rootArr) => {
      if (rootArr[rootIndex + 1] === undefined) {
        // out of bounds
        return;
      }

      pointPath1.forEach((subCoords, subIndex, subArr) => {
        if (subArr[subIndex + 1] === undefined) {
          // out of bounds
          return;
        }

        const nextSubCoords = subArr[subIndex + 1];
        const nextRootCoords = rootArr[rootIndex + 1];

        const intersection = mathjs.intersect(
          coordsAsArr(subCoords),
          coordsAsArr(nextSubCoords),
          coordsAsArr(rootCoords),
          coordsAsArr(nextRootCoords)
        );

        if (intersection) {
          const intObj = coordsAsObj(intersection);

          // is the intersection happening within the two lines or somewhere outside?
          if (
            this.isCoordinateWithinLine(subCoords, nextSubCoords, intObj) &&
            this.isCoordinateWithinLine(rootCoords, nextRootCoords, intObj)
          ) {
            intersections.push({
              firstPathPercentage: subIndex / (subArr.length - 1) * 100 || 0,
              secondPathPercentage: rootIndex / (rootArr.length - 1) * 100 || 0
            });
          }
        }
      });
    });

    return intersections;
  }

  static getLineDimensions(lineStart, lineEnd) {
    const width = Math.abs(lineStart.x - lineEnd.x);
    const height = Math.abs(lineStart.y - lineEnd.y);
    const minX = Math.min(lineStart.x, lineEnd.x);
    const minY = Math.min(lineStart.y, lineEnd.y);

    return {
      width,
      height,
      minX,
      minY
    };
  }

  static isCoordinateWithinLine(lineStart, lineEnd, coords) {
    const { width, height, minX, minY } = this.getLineDimensions(lineStart, lineEnd);
    return coords.x <= minX + width && coords.x >= minX && coords.y <= minY + height && coords.y >= minY;
  }

  static getAngle(startPoint, endPoint) {
    return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * 180 / Math.PI;
  }

  static compareShapes(pointPath1, pointPath2, convertToPoints = false, accuracyPercentage = 10) {
    return Sketchy.shapeContextMatch(pointPath1, pointPath2, convertToPoints, accuracyPercentage);
  }
}
