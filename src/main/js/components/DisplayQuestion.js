import React from 'react';

const DisplayQuestion = (props) => {
  let questionText;
  if (props.questionType === 'reading') {
    questionText = {
      GuessPlayPage: (
        <div>
          <h2>Läsform: {props.question[0]}</h2>
          <h2>Skrivform: {(props.question.length > 1) ? props.question[1] : ''}</h2>
        </div>
      ),
      QuizPlayPage: <h2>{props.question[0]}</h2>
    };
  } else {
    questionText = {
      GuessPlayPage: <h2>{props.question[0]}</h2>,
      QuizPlayPage: <h2>{props.question[0]}</h2>
    };
  }
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
