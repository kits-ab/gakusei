/* eslint-env node */

import { lessons, defaultState, fetchUserSuccessRate, resetLesson } from './Lessons';
import * as sinon from 'sinon';

describe('Lessons', () => {
  describe('Reducer', () => {
    it('should return default state', () => {
      const newState = lessons(defaultState, {});
      expect(newState).to.eq(defaultState);
    });

    it('should set all buttons to disabled state', () => {
      const newState = lessons(defaultState, {
        type: 'SET_ALL_BUTTONS_DISABLED_STATE',
        allButtonsDisabled: true
      });
      expect(newState.allButtonsDisabled).to.equal(true);
    });

    it('should receive lesson', () => {
      const newState = lessons(defaultState, {
        type: 'RECEIVE_LESSON',
        questions: [{}, {}, {}]
      });
      expect(newState.lessonLength).to.equal(3);
    });
  });

  describe('...other functions', () => {
    it('should fetch userSuccessRate', () => {
      const fetchStub = sinon.stub().resolves({ json: () => {} });
      global.fetch = fetchStub;
      fetchUserSuccessRate('gurra')(() => {});
      expect(fetchStub.callCount).to.equal(1);
    });

    it('should reset lessong', () => {
      const dispatchSpy = sinon.spy();
      resetLesson()(dispatchSpy);
      expect(dispatchSpy.callCount).to.equal(4);
    });
  });
});
