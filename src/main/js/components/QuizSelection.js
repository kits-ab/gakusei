import React from 'react';
import GenericSelection from './GenericSelection';

const lessons = ['Den japanska floran', 'Japanska städer 3', 'Fujis vulkaniska bergarter'];
const QuizSelection = props => <GenericSelection {...props} lessonNames={lessons} />;

export default QuizSelection;
