import React from 'react';
import { connect } from 'react-redux';
import GenericSelection from './GenericSelection';
import * as Store from '../Store';

const LessonSelection = () => <GenericSelection />;


// Selects which state properties are merged into the component's props
function mapStateToProps(state) {
  return Object.assign({},
      state.Main);
}

// Selects which action creators are merged into the component's props
function mapActionCreatorsToProps() {
  return Object.assign({},
      Store.actionCreators);
}

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    mapStateToProps,
    mapActionCreatorsToProps
)(LessonSelection);
