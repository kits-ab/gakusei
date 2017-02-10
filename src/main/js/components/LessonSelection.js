import React from 'react';
import { connect } from 'react-redux';
import GenericSelection from './GenericSelection';
import * as UserStatisticsStore from '../store/UserStatistics';

const LessonSelection = props => <GenericSelection {...props} />;

export default connect(
    state => ({ ...state.userStatistics }), // Selects which state properties are merged into the component's props
    { ...UserStatisticsStore.actionCreators } // Selects which action creators are merged into the component's props
)(LessonSelection);
