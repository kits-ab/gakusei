import React from 'react';
import GenericSelection from './GenericSelection';

const lessons = ['Den japanska floran'];
const QuizSelection = props => <GenericSelection {...props} lessonNames={lessons} fetchURL="/api/quiz" />;

export default QuizSelection;
