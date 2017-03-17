import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { lessons } from './Lessons';
import { security } from './Security';
import { statistics } from './Statistics';

const rootReducer = combineReducers({
  lessons,
  security,
  statistics,
  routing: routerReducer
});

export default rootReducer;
