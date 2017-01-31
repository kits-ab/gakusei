import React from 'react';
import GenericSelection from './GenericSelection';

const lessons = ['JLPT N3', 'JLPT N4', 'JLPT N5', 'GENKI 1', 'GENKI 13', 'GENKI 15'];
const LessonSelection = props => <GenericSelection {...props} lessonNames={lessons} />;

export default LessonSelection;
