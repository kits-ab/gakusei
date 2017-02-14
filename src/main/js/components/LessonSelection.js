import React from 'react';
import { connect } from 'react-redux';
import GenericSelection from './GenericSelection';
import * as Store from '../Store';

const LessonSelection = () => <GenericSelection />;

export default connect(
    // Selects which state properties are merged into the component's props
    state => (state.reducer),
    // Selects which action creators are merged into the component's props
    Store.actionCreators
)(LessonSelection);
