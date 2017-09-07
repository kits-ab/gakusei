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

    public final String QN_ID = "id";
    public final String QN_QUIZ_REF = "quizRef";
    public final String QN_QUESTION = "question";
    public final String QN_CORRECT_ANSWER = "correctAnswer";
    public final String QN_INCORRECT_ANSWERS = "incorrectAnswers";

    public final String IA_INCORRECT_ANSWERS = "incorrectAnswer";
    public final String IA_ID = "id";

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

    public HashMap<String, Object> createAndValidateQuizNugget(HashMap<String, Object> myQuizNugget) throws QuizException {
        this.validateQuizNugget(myQuizNugget, false);
        this.validateIncorrectAnswers((List<?>) myQuizNugget.get(this.QN_INCORRECT_ANSWERS), false, null);
        return this.createQuizNugget(myQuizNugget);
    }

    private HashMap<String, Object> createQuizNugget(HashMap<String, Object> myQuizNugget) {
        QuizNugget quizNugget = new QuizNugget();
        quizNugget.setQuestion((String) myQuizNugget.get(this.QN_QUESTION));
        quizNugget.setCorrectAnswer((String) myQuizNugget.get(this.QN_CORRECT_ANSWER));
        quizNugget.setQuiz(this.quizRepository.findOne(new Long((Integer) myQuizNugget.get(this.QN_QUIZ_REF))));
        HashMap<String, Object> newMyQuizNugget = this.convertQuizNugget(quizNuggetRepository.save(quizNugget));

        for (Object myIncorrectAnswer : (List) myQuizNugget.get(this.QN_INCORRECT_ANSWERS)) {
            this.createIncorrectAnswer((HashMap) myIncorrectAnswer, quizNugget);
        }
        return newMyQuizNugget;
    }

    private void createIncorrectAnswer(HashMap<String, Object> myIncorrectAnswer, QuizNugget quizNugget) {
        IncorrectAnswers incorrectAnswer = new IncorrectAnswers();
        incorrectAnswer.setIncorrectAnswer((String) myIncorrectAnswer.get(this.IA_INCORRECT_ANSWERS));
        incorrectAnswer.setQuizNugget(quizNugget);
        incorrectAnswerRepository.save(incorrectAnswer);
    }

    public void updateAndValidateQuizNugget(HashMap<String, Object> myQuizNugget) throws QuizException {
        this.validateQuizNugget(myQuizNugget, true);
        this.validateIncorrectAnswers((List<?>) myQuizNugget.get(this.QN_INCORRECT_ANSWERS), true,
                new Long((int) myQuizNugget.get(this.QN_ID)));

        this.updateQuizNugget(myQuizNugget);

        int i = 0;
        for (Object myIncorrectAnswer : (List) myQuizNugget.get(this.QN_INCORRECT_ANSWERS)) {
            this.updateIncorrectAnswer((HashMap<String, Object>) myIncorrectAnswer);
            i++;
        }
    }

    private void updateQuizNugget(HashMap<String, Object> myQuizNugget) {
        QuizNugget quizNugget = this.quizNuggetRepository.findOne(new Long((int) myQuizNugget.get(this.QN_ID)));
        quizNugget.setQuestion((String) myQuizNugget.get(this.QN_QUESTION));
        quizNugget.setCorrectAnswer((String) myQuizNugget.get(this.QN_CORRECT_ANSWER));

        Quiz quizRef = this.quizRepository.findOne(new Long((int) myQuizNugget.get(this.QN_QUIZ_REF)));
        quizNugget.setQuiz(quizRef);

        this.quizNuggetRepository.save(quizNugget);
    }

    private void updateIncorrectAnswer(HashMap<String, Object> myIncorrectAnswer) {
        IncorrectAnswers incorrectAnswer = this.incorrectAnswerRepository.findOne(
                new Long((int) myIncorrectAnswer.get(this.IA_ID)));
        incorrectAnswer.setIncorrectAnswer((String) myIncorrectAnswer.get(this.IA_INCORRECT_ANSWERS));

        this.incorrectAnswerRepository.save(incorrectAnswer);
    }

    // ----------------------------
    // -- VALIDATORS
    // ----------------------------

    public void validateQuizNugget(HashMap<String, Object> myQuizNugget, boolean onUpdate) throws QuizException {
        if (!myQuizNugget.containsKey(this.QN_QUIZ_REF))
            throw new QuizException("No quiz ref");
        if (!myQuizNugget.containsKey(this.QN_QUESTION))
            throw new QuizException("No question");
        if (!myQuizNugget.containsKey(this.QN_CORRECT_ANSWER))
            throw new QuizException("No correct answer");
        if (!myQuizNugget.containsKey(this.QN_INCORRECT_ANSWERS))
            throw new QuizException("No incorrect answers");

        if(!(myQuizNugget.get(this.QN_QUIZ_REF) instanceof Integer))
            throw new QuizException("Quiz ref has wrong type");
        if(!(myQuizNugget.get(this.QN_QUESTION) instanceof String))
            throw new QuizException("Question has wrong type");
        if(!(myQuizNugget.get(this.QN_CORRECT_ANSWER) instanceof String))
            throw new QuizException("Correct answer has wrong type");
        if(!(myQuizNugget.get(this.QN_INCORRECT_ANSWERS) instanceof List<?>))
            throw new QuizException("Correct answers have wrong type");

        if (!this.quizRepository.exists(new Long((Integer) myQuizNugget.get(this.QN_QUIZ_REF))))
            throw new QuizException("Quiz ref does not exist");

        if (onUpdate) {
            if (!myQuizNugget.containsKey(this.QN_ID))
                throw new QuizException("No quiz nugget id");
            if(!(myQuizNugget.get(this.QN_ID) instanceof Integer))
                throw new QuizException("Quiz nugget id has wrong type");
            if (!this.quizNuggetRepository.exists(new Long((int) myQuizNugget.get(this.QN_ID))))
                throw new QuizException("The quiz nugget does not exist");
        }
    }

    private void validateIncorrectAnswers(List<?> myIncorrectAnswers, boolean onUpdate,
                                          Long quizNuggetId) throws QuizException {
        if (myIncorrectAnswers.size()<3)
            throw new QuizException("At least 3 incorrect answers should be provided");
        int i = 0;
        for (Object myIncorrectAnswer : myIncorrectAnswers) {
            if (! (myIncorrectAnswer instanceof HashMap<?, ?>)) {
                throw new QuizException(String.format("Incorrect answer on pos %d has wrong type", i));
            }
            this.validateIncorrectAnswer((HashMap<String, Object>) myIncorrectAnswer, onUpdate, quizNuggetId);
            i++;
        }
    }

    public void validateIncorrectAnswer(HashMap<String, Object> myIncorrectAnswer, boolean onUpdate,
                                         Long quizNuggetId) throws QuizException {
        if (!myIncorrectAnswer.containsKey(this.IA_INCORRECT_ANSWERS))
            throw new QuizException("No incorrect answer");
        if(!(myIncorrectAnswer.get(this.IA_INCORRECT_ANSWERS) instanceof String))
            throw new QuizException("Incorrect answer has wrong type");

        if (onUpdate) {
            if (!myIncorrectAnswer.containsKey(this.IA_ID))
                throw new QuizException("No incorrect-answer id");
            if(!(myIncorrectAnswer.get(this.QN_ID) instanceof Integer))
                throw new QuizException("Incorrect-answer id has wrong type");
            if (!this.incorrectAnswerRepository.existsByIdAndQuizNuggetId(
                    new Long((int) myIncorrectAnswer.get(this.QN_ID)), quizNuggetId))
                throw new QuizException(String.format("The incorrect-answer with id: %d does not exist",
                        (int) myIncorrectAnswer.get(this.QN_ID)));
        }
    }

    public class QuizException extends Exception {
        public QuizException() { super(); }
        public QuizException(String message) { super(message); }

        @Override
        public String toString() {
            return String.format("QuizException: %s", this.getMessage());
        }
    }
}
