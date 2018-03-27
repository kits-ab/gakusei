/* eslint-env node */
// const signFilename = sign => '0' + sign.charCodeAt(0).toString(16) + ".svg";
// const sign = '今';

import testDataImport from './DrawArea.rules.data.json';
import * as rules from './DrawArea.rules';
// import Geometry from '../../../../../shared/util/Geometry';

describe('kanji drawing rules should work as intended', () => {
  it('should take in some data without error', () => {
    const testData = testDataImport;
    const ruleData = testData['rule-data'];
    expect(() => rules.isLineIntersectingOtherLines({}, ruleData)).to.not.throw();
    expect(() => rules.isLineAccurate({}, ruleData)).to.not.throw();
    expect(() => rules.areLinesAccurate({}, ruleData)).to.not.throw();
    expect(() => rules.isCorrectDirection({}, ruleData)).to.not.throw();
  });
});
