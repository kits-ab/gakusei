import React from 'react';
import GenericSelection from './GenericSelection';

const QuizSelection = props => <GenericSelection {...props} fetchURL="/api/quiz" />;

export default QuizSelection;
