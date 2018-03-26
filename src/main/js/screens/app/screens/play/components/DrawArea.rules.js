import simplify from 'simplify-js';
import Geometry from '../../../../../shared/util/Geometry';

export function isLineIntersectingOtherLines(ruleOptions, data) {
  const intersections = [];

  data.correctLines.forEach((correctLine, correctLineIndex) => {
    // don't compare correct line with its own answer
    if (correctLineIndex !== data.userLines.length - 1) {
      const lineIntersections = Geometry.getIntersections(data.userLine, correctLine);
      if (lineIntersections.length > 0) {
        intersections.push({
          otherLineIndex: correctLineIndex,
          lineIntersections
        });
      }
    }
  });

  return {
    value: intersections.length > 0,
    message: intersections
  };
}

export function isLineAccurate(ruleOptions, data) {
  // Calculate accuracy for this shape
  const decimalAccuracy = Geometry.compareShapes(
    [data.correctLine],
    [data.userLine],
    false,
    ruleOptions.strictnessPercentage
  );
  const floatAccuracy = parseFloat(decimalAccuracy * 100);

  return {
    value: floatAccuracy > ruleOptions.requiredAccuracyPercentage,
    message: floatAccuracy.toFixed(2)
  };
}

export function areLinesAccurate(ruleOptions, data) {
  // Calculate accuracy for all lines
  const correctLinesUpUntilLastUserLine = data.correctLines.slice(0, data.userLines.length);
  const decimalAccuracy = Geometry.compareShapes(
    correctLinesUpUntilLastUserLine,
    data.userLines,
    false,
    ruleOptions.strictnessPercentage
  );
  const floatAccuracy = parseFloat(decimalAccuracy * 100);

  return {
    value: floatAccuracy > ruleOptions.requiredAccuracyPercentage,
    message: floatAccuracy.toFixed(2)
  };
}

export function isCorrectDirection(ruleOptions, data) {
  // Get starting angle of drawn path
  const startAngle = Geometry.getAngle(data.userLine[0], data.userLine[data.userLine.length - 1]);

  // Get starting angle of correct answer
  const answerStartAngle = Geometry.getAngle(data.correctLine[0], data.correctLine[data.correctLine.length - 1]);

  // Check whether the user started drawing on the correct end of the line
  return {
    value: answerStartAngle - 90 < startAngle && answerStartAngle + 90 > startAngle,
    message: ''
  };
}
