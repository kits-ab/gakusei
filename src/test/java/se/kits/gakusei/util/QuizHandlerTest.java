package se.kits.gakusei.util;

import org.junit.Test;
import org.junit.runner.RunWith;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import se.kits.gakusei.content.model.IncorrectAnswers;
import se.kits.gakusei.content.model.Quiz;
import se.kits.gakusei.content.model.QuizNugget;
import se.kits.gakusei.content.repository.IncorrectAnswerRepository;
import se.kits.gakusei.content.repository.QuizNuggetRepository;
import se.kits.gakusei.content.repository.QuizRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
public class QuizHandlerTest {

    @Autowired
    private QuizHandler quizHandler;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizNuggetRepository quizNuggetRepository;

    @Autowired
    private IncorrectAnswerRepository incorrectAnswerRepository;

    private Quiz generateQuiz() {
        Quiz quiz = new Quiz();
        quiz.setName("Temp quiz");
        quiz.setDescription("Temp quiz");
        return this.quizRepository.save(quiz);
    }

    private QuizNugget generateQuizNugget(boolean save) {
        QuizNugget quizNugget = new QuizNugget();
        quizNugget.setQuestion("?");
        quizNugget.setCorrectAnswer("42");
        Quiz quizRef = generateQuiz();
        quizNugget.setQuiz(quizRef);

        if (save)
            quizNugget = this.quizNuggetRepository.save(quizNugget);
        return quizNugget;
    }

    private IncorrectAnswers generateIncorrectAnswer() {
        IncorrectAnswers incorrectAnswers = new IncorrectAnswers();
        incorrectAnswers.setIncorrectAnswer("Incorrect");
        QuizNugget quizNugget = this.generateQuizNugget(true);
        incorrectAnswers.setQuizNugget(quizNugget);
        incorrectAnswers = this.incorrectAnswerRepository.save(incorrectAnswers);
        return incorrectAnswers;
    }

    private HashMap<String, Object> constructQuizNugget() {
        HashMap<String, Object> quizNugget = this.quizHandler.convertQuizNugget(this.generateQuizNugget(false));
        // NEEDS TO BE AN INT
        quizNugget.put(this.quizHandler.QN_QUIZ_REF, ((Long) quizNugget.get(this.quizHandler.QN_QUIZ_REF)).intValue());

        List<HashMap<String, Object>> incorrectAnswers = new ArrayList<>();
        for (int i=0; i<3; i++) {
            HashMap<String, Object> incorrectAnswer = new HashMap<>();
            incorrectAnswer.put("incorrectAnswer", "answer"+i);
            incorrectAnswers.add(incorrectAnswer);
        }
        quizNugget.put("incorrectAnswers", incorrectAnswers);

        return quizNugget;
    }

    private boolean checkvalidateIncorrectAnswer(HashMap<String, Object> incorrect_answer, boolean onUpdate, Long quizNuggetId) {
        boolean success = true;
        try {
            quizHandler.validateIncorrectAnswer(incorrect_answer, onUpdate, quizNuggetId);
        } catch (Exception exc) {
            success = false;
        }
        return success;
    }

    @Test
    public void testValidateIncorrectAnswer() throws Exception {
        HashMap<String, Object> myIncorrectAnswer = new HashMap<>();
        assertEquals(false, this.checkvalidateIncorrectAnswer(myIncorrectAnswer, false, null));

        myIncorrectAnswer.put(this.quizHandler.IA_INCORRECT_ANSWERS, "Test");
        assertEquals(true, this.checkvalidateIncorrectAnswer(myIncorrectAnswer, false, null));

        HashMap<String, Object> myQuizNugget = this.constructQuizNugget();
        assertEquals(false, this.checkvalidateIncorrectAnswer(myIncorrectAnswer, true,
                (Long) myQuizNugget.get(this.quizHandler.QN_ID)));

        myIncorrectAnswer.put(this.quizHandler.IA_ID, 42);
        assertEquals(false, this.checkvalidateIncorrectAnswer(myIncorrectAnswer, true,
                (Long) myQuizNugget.get(this.quizHandler.QN_ID)));

        IncorrectAnswers incorrectAnswer = this.generateIncorrectAnswer();
        myIncorrectAnswer.put(this.quizHandler.IA_ID, (int) incorrectAnswer.getId());
        assertEquals(true, this.checkvalidateIncorrectAnswer(myIncorrectAnswer, true,
                incorrectAnswer.getQuizNugget().getId()));
    }

    private boolean checkvalidateQuizNugget(HashMap<String, Object> myQuizNugget) {
        boolean success = true;
        try {
            quizHandler.validateQuizNugget(myQuizNugget, false);
        } catch (Exception exc) {
            success = false;
        }
        return success;
    }

    @Test
    public void testValidateQuizNugget() throws Exception {
        HashMap<String, Object> myQuizNugget = new HashMap<>();

        assertEquals(false, this.checkvalidateQuizNugget(myQuizNugget));

        myQuizNugget.put(this.quizHandler.QN_QUIZ_REF, "42");
        assertEquals(false, this.checkvalidateQuizNugget(myQuizNugget));

        myQuizNugget.put(this.quizHandler.QN_QUESTION, "Test");
        assertEquals(false, this.checkvalidateQuizNugget(myQuizNugget));

        myQuizNugget.put(this.quizHandler.QN_CORRECT_ANSWER, "Test");
        assertEquals(false, this.checkvalidateQuizNugget(myQuizNugget));

        myQuizNugget.put(this.quizHandler.QN_INCORRECT_ANSWERS, new ArrayList<>());
        assertEquals(false, this.checkvalidateQuizNugget(myQuizNugget));

        Quiz quiz = this.generateQuiz();
        myQuizNugget.put(this.quizHandler.QN_QUIZ_REF, (int) quiz.getId());
        assertEquals(true, this.checkvalidateQuizNugget(myQuizNugget));
    }

    @Test
    public void testCreateQuizNugget() throws Exception {
        HashMap<String, Object> quizNugget = null;
        try {
            quizNugget = quizHandler.createAndValidateQuizNugget(this.constructQuizNugget());
        } catch (Exception exc) {
            assert false;
        }

        assertTrue(quizNugget.containsKey("id"));
        assertTrue(this.quizNuggetRepository.exists((Long) quizNugget.get("id")));
    }
}
