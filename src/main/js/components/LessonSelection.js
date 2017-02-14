import React from 'react';
import GenericSelection from './GenericSelection';

const LessonSelection = props => <GenericSelection {...props} fetchURL="/api/questions" />;

export default LessonSelection;
