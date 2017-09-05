package se.kits.gakusei.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
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

    private final String QN_ID = "id";
    private final String QN_QUIZ_REF = "quizRef";
    private final String QN_QUESTION = "question";
    private final String QN_CORRECT_ANSWER = "correctAnswer";
    private final String QN_INCORRECT_ANSWERS = "incorrectAnswers";

    private final String IA_INCORRECT_ANSWERS = "incorrectAnswer";
    private final String IA_ID = "id";

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizNuggetRepository quizNuggetRepository;

    @Autowired
    private IncorrectAnswerRepository incorrectAnswerRepository;

    public List<HashMap<String, Object>> getQuizNuggets(Quiz quiz) {
        List<QuizNugget> quizNuggets = quizNuggetRepository.findByQuiz_Id(quiz.getId());
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

    private HashMap<String, Object> convertQuizNugget(QuizNugget quizNugget) {
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

    public HashMap<String, Object> createAndValidateQuizNugget(HashMap<String, Object> myQuizNugget) throws Exception {
        this.validateQuizNugget(myQuizNugget);
        this.validateIncorrectAnswers((List<?>) myQuizNugget.get(this.QN_INCORRECT_ANSWERS));
        return this.createQuizNugget(myQuizNugget);
    }

    private HashMap<String, Object> createQuizNugget(HashMap<String, Object> myQuizNugget) throws Exception {
        QuizNugget quizNugget = new QuizNugget();
        quizNugget.setQuestion((String) myQuizNugget.get(this.QN_QUESTION));
        quizNugget.setCorrectAnswer((String) myQuizNugget.get(this.QN_CORRECT_ANSWER));
        quizNugget.setQuiz(this.quizRepository.findOne(new Long((Integer) myQuizNugget.get(this.QN_QUIZ_REF))));
        HashMap<String, Object> newMyQuizNugget = this.convertQuizNugget(quizNuggetRepository.save(quizNugget));

        for (Object myIncorrectAnswer : (List) myQuizNugget.get(this.QN_INCORRECT_ANSWERS)) {
            IncorrectAnswers incorrectAnswer = new IncorrectAnswers();
            incorrectAnswer.setIncorrectAnswer((String) ((HashMap) myIncorrectAnswer)
                                                         .get(this.IA_INCORRECT_ANSWERS));
            incorrectAnswer.setQuizNugget(quizNugget);
            incorrectAnswerRepository.save(incorrectAnswer);
        }
        return newMyQuizNugget;
    }

    // ----------------------------
    // -- VALIDATORS
    // ----------------------------

    private void validateQuizNugget(HashMap<String, Object> myQuizNugget) throws Exception {
        if (!myQuizNugget.containsKey(this.QN_QUIZ_REF))
            throw new Exception("No quiz ref");
        if (!myQuizNugget.containsKey(this.QN_QUESTION))
            throw new Exception("No question");
        if (!myQuizNugget.containsKey(this.QN_CORRECT_ANSWER))
            throw new Exception("No correct answer");
        if (!myQuizNugget.containsKey(this.QN_INCORRECT_ANSWERS))
            throw new Exception("No incorrect answers");

        if(!(myQuizNugget.get(this.QN_QUIZ_REF) instanceof Integer))
            throw new Exception("Quiz ref has wrong type");
        if(!(myQuizNugget.get(this.QN_QUESTION) instanceof String))
            throw new Exception("Question has wrong type");
        if(!(myQuizNugget.get(this.QN_CORRECT_ANSWER) instanceof String))
            throw new Exception("Correct answer has wrong type");
        if(!(myQuizNugget.get(this.QN_INCORRECT_ANSWERS) instanceof List<?>))
            throw new Exception("Correct answers have wrong type");

        if (!this.quizRepository.exists(new Long((Integer) myQuizNugget.get(this.QN_QUIZ_REF))))
            throw new Exception("Quiz ref does not exist");

        return;
    }

    private void validateIncorrectAnswers(List<?> myIncorrectAnswers) throws Exception {
        int i = 0;
        for (Object myIncorrectAnswer : myIncorrectAnswers) {
            if (! (myIncorrectAnswer instanceof HashMap<?, ?>)) {
                throw new Exception("Incorrect answer on pos "+i+" has wrong type");
            }
            this.validateIncorrectAnswer((HashMap<String, Object>) myIncorrectAnswer);
            i++;
        }

        if (i!=3)
            throw new Exception("3 incorrect answers should be provided");

        return;
    }

    private void validateIncorrectAnswer(HashMap<String, Object> myIncorrectAnswer) throws Exception {
        if (!myIncorrectAnswer.containsKey(this.IA_INCORRECT_ANSWERS))
            throw new Exception("No incorrect answer");
        if(!(myIncorrectAnswer.get(this.IA_INCORRECT_ANSWERS) instanceof String))
            throw new Exception("Incorrect answer has wrong type");

        return;
    }
}
