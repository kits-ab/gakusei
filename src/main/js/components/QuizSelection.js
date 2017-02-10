import React from 'react';
import { connect } from 'react-redux';
import * as Store from '../Store';

import GenericSelection from './GenericSelection';

const lessons = ['Den japanska floran'];
const QuizSelection = () => <GenericSelection lessonNames={lessons} fetchURL="/api/quiz" />;

export default connect(
    // Selects which state properties are merged into the component's props
    state => (state.reducer),
    // Selects which action creators are merged into the component's props
    Store.actionCreators
)(QuizSelection);
