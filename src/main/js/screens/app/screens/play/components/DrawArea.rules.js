import simplify from 'simplify-js';
import Geometry from '../../../../../shared/util/Geometry';

export function isLineAccurate(ruleOptions, data) {
  // Calculate accuracy for this shape
  const accuracy = Geometry.compareShapes([data.correctLine], [data.userLine], false, ruleOptions.strictnessPercentage);

  return {
    value: accuracy > ruleOptions.requiredAccuracyPercentage,
    message: parseFloat(accuracy * 100).toFixed(2)
  };
}

export function areLinesAccurate(ruleOptions, data) {
  // Calculate accuracy for all lines
  const accuracy = Geometry.compareShapes(data.correctLines, data.userLines, false, ruleOptions.strictnessPercentage);

  return {
    value: accuracy > ruleOptions.requiredAccuracyPercentage,
    message: parseFloat(accuracy * 100).toFixed(2)
  };
}

export function isCorrectDirection(ruleOptions, data) {
  // Get starting angle of drawn path
  const startAngle = Geometry.getAngle(data.userLine[0], data.userLines[data.userLines.length - 1]);

  // Get starting angle of correct answer
  const answerStartAngle = Geometry.getAngle(data.correctLine[0], data.correctLines[data.correctLines.length - 1]);

  // Check whether the user started drawing on the correct end of the line
  return {
    value: answerStartAngle - 90 < startAngle && answerStartAngle + 90 > startAngle,
    message: ''
  };
}
