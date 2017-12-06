package se.kits.gakusei.util.csv;

import se.kits.gakusei.content.model.IncorrectAnswer;
import se.kits.gakusei.content.model.Quiz;
import se.kits.gakusei.content.model.QuizNugget;
import se.kits.gakusei.util.ParserFailureException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CSVQuizNugget {

    private String[] values;

    private final int NAME_INDEX = 0;
    private final int DESCRIPTION_INDEX = 1;
    private final int QUESTION_INDEX = 2;
    private final int CORRECT_ANSWER_INDEX = 3;
    private final int INCORRECT_ANSWERS_INDEX = 4;

    private final int EXPECTED_NUMBER_OF_VALUES = 5;

    private final int EXPECTED_NUMBER_OF_INCORRECT_ANSWERS = 3;

    public CSVQuizNugget(String[] values){
        this.values = values;
        initialCheck();
    }

    private void initialCheck(){
        if(values.length != EXPECTED_NUMBER_OF_VALUES){
            throw new ParserFailureException("Unexpected number of values in row: " + Arrays.toString(values)
                    + "\nExpected " + EXPECTED_NUMBER_OF_VALUES + " but got " + values.length);
        }
    }

    public Quiz getQuiz() {
        Quiz quiz = new Quiz();
        quiz.setName(values[NAME_INDEX]);
        quiz.setDescription(values[DESCRIPTION_INDEX]);

        return quiz;
    }

    public QuizNugget getQuizNugget(Quiz quiz) {
        QuizNugget quizNugget = new QuizNugget();
        quizNugget.setQuestion(values[QUESTION_INDEX]);
        quizNugget.setCorrectAnswer(values[CORRECT_ANSWER_INDEX]);
        quizNugget.setQuiz(quiz);

        return quizNugget;
    }

    public Iterable<IncorrectAnswer> getIncorrectAnswers(QuizNugget quizNugget) {
        List<IncorrectAnswer> ias = new ArrayList<>();
        String s = values[INCORRECT_ANSWERS_INDEX];
        // List of incorrect answers is comma separated
        String [] stringIas = s.split(",");
        if (stringIas.length < EXPECTED_NUMBER_OF_INCORRECT_ANSWERS) {
            throw new ParserFailureException("Too few incorrect answers provided in row: " + Arrays.toString(values) +
                    "\nExpected " + Integer.toString(EXPECTED_NUMBER_OF_INCORRECT_ANSWERS) +
                    " but got " + Integer.toString(stringIas.length));
        }
        for (String ia: stringIas) {
            ias.add(getIncorrectAnswer(ia.trim(), quizNugget));
        }
        return ias;
    }

    private IncorrectAnswer getIncorrectAnswer(String s, QuizNugget quizNugget) {
        IncorrectAnswer ia = new IncorrectAnswer();
        ia.setIncorrectAnswer(s);
        ia.setQuizNugget(quizNugget);
        return ia;
    }

}
