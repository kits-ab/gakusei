package se.kits.gakusei.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.thymeleaf.util.ArrayUtils;
import se.kits.gakusei.content.model.IncorrectAnswers;
import se.kits.gakusei.content.model.Quiz;
import se.kits.gakusei.content.model.QuizNugget;
import se.kits.gakusei.content.repository.QuizRepository;
import se.kits.gakusei.content.repository.QuizNuggetRepository;
import se.kits.gakusei.content.repository.IncorrectAnswerRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Component
public class QuizHandler {

    public final String QN_ID = "id";
    public final String QN_QUIZ_REF = "quizRef";
    public final String QN_QUESTION = "question";
    public final String QN_CORRECT_ANSWER = "correctAnswer";
    public final String QN_INCORRECT_ANSWERS = "incorrectAnswers";

    public final String IA_INCORRECT_ANSWERS = "incorrectAnswer";
    public final String IA_ID = "id";

    @Autowired
    protected QuizRepository quizRepository;

    @Autowired
    protected QuizNuggetRepository quizNuggetRepository;

    @Autowired
    protected IncorrectAnswerRepository incorrectAnswerRepository;

    public List<HashMap<String, Object>> getQuizNuggets(Long quizId) {
        List<QuizNugget> quizNuggets = quizNuggetRepository.findByQuiz_Id(quizId);
        List<HashMap<String, Object>> myQuizNuggets = new ArrayList<>();

        for (QuizNugget quizNugget : quizNuggets) {
            HashMap<String, Object> myQuizNugget = this.convertQuizNugget(quizNugget);
            myQuizNuggets.add(myQuizNugget);
        }
        return myQuizNuggets;
    }

    public HashMap<String, Object> getQuizNugget(Long quizNuggetId) {
        HashMap<String, Object> myQuizNugget = this.convertQuizNugget(this.quizNuggetRepository.findOne(quizNuggetId));
        myQuizNugget.put(this.QN_INCORRECT_ANSWERS, this.getIncorrectAnswers(quizNuggetId));

        return myQuizNugget;
    }

    public HashMap<String, Object> convertQuizNugget(QuizNugget quizNugget) {
        HashMap<String, Object> myQuizNugget = new HashMap<>();
        myQuizNugget.put(this.QN_ID, quizNugget.getId());
        myQuizNugget.put(this.QN_QUIZ_REF, quizNugget.getQuiz().getId());
        myQuizNugget.put(this.QN_QUESTION, quizNugget.getQuestion());
        myQuizNugget.put(this.QN_CORRECT_ANSWER, quizNugget.getCorrectAnswer());
        myQuizNugget.put(this.QN_INCORRECT_ANSWERS, this.getIncorrectAnswers(quizNugget.getId()));

        return myQuizNugget;
    }

    private List<HashMap<String, Object>> getIncorrectAnswers(Long quizNuggetId) {
        List<HashMap<String, Object>> myIncorrectAnswers = new ArrayList<>();
        List<IncorrectAnswers> incorrectAnswers = incorrectAnswerRepository.getByQuizNugget_Id(quizNuggetId);
        for (IncorrectAnswers incorrectAnswer : incorrectAnswers)
            myIncorrectAnswers.add(this.convertIncorrectAnswer(incorrectAnswer));

        return myIncorrectAnswers;
    }

    private HashMap<String, Object> convertIncorrectAnswer(IncorrectAnswers incorrectAnswers) {
        HashMap<String, Object> myIncorrectAnswer = new HashMap<>();
        myIncorrectAnswer.put(this.IA_ID, incorrectAnswers.getId());
        myIncorrectAnswer.put(this.IA_INCORRECT_ANSWERS, incorrectAnswers.getIncorrectAnswer());

        return myIncorrectAnswer;
    }
}
