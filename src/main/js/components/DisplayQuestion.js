import React from 'react';

const DisplayQuestion = (props) => {
  let guessPlayDisplay;
  if (props.questionType === 'reading') {
    guessPlayDisplay = (
      <div>
        <h2>Läsform: {props.question[0]}</h2>
        {props.question.length > 1 ? <h2>Writing: {props.question[1]}</h2> : <div />}
      </div>);
  } else {
    guessPlayDisplay = <h2>{props.question[0]}</h2>;
  }
  const questionText = {
    GuessPlayPage: guessPlayDisplay,
    QuizPlayPage: <h2>{props.question[0]}</h2>
  };
  let resource;
  if (props.resourceRef && props.resourceRef.type === 'kanjidrawing') {
    resource = <object height="50em" type="image/svg+xml" data={props.resourceRef.location}>SVG error</object>;
  }
  return (
    resource ? <div>{resource}<br />{questionText[props.pageName]}</div> : questionText[props.pageName]
  );
};

DisplayQuestion.propTypes = {
  questionType: React.PropTypes.string.isRequired,
  question: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  pageName: React.PropTypes.string.isRequired
};

export default DisplayQuestion;
