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
        HashMap<String, String> errors = new HashMap<>();
        String[] keys = {this.QN_QUIZ_REF, this.QN_QUESTION, this.QN_CORRECT_ANSWER, this.QN_INCORRECT_ANSWERS};

        for (String key : keys) {
            if (!myQuizNugget.containsKey(key))
                errors.put(key, "Missing");
        }

        for (String key : keys) {
            if (!errors.containsKey(key)) {
                if (key == this.QN_QUIZ_REF) {
                    if (!(myQuizNugget.get(key) instanceof Integer))
                        errors.put(key, "Wrong type, should be a int");
                } else if (key == this.QN_INCORRECT_ANSWERS) {
                    if (!(myQuizNugget.get(key) instanceof List<?>))
                        errors.put(key, "Wrong type, should be a list");
                } else {
                    if (!(myQuizNugget.get(key) instanceof String))
                        errors.put(key, "Wrong type, should be a string");
                }
            }
        }

        if (!errors.containsKey(this.QN_QUIZ_REF)) {
            if (!this.quizRepository.exists(new Long((Integer) myQuizNugget.get(this.QN_QUIZ_REF))))
                errors.put(this.QN_QUIZ_REF, "Does not exist");
        }

        if (onUpdate) {
            if (!myQuizNugget.containsKey(this.QN_ID))
                errors.put(this.QN_ID, "Missing");
            else if(!(myQuizNugget.get(this.QN_ID) instanceof Integer))
                errors.put(this.QN_ID, "Wrong type, should be int");
            else if (!this.quizNuggetRepository.exists(new Long((int) myQuizNugget.get(this.QN_ID))))
                errors.put(this.QN_ID, "Does not exist");
        }

        if (!errors.isEmpty())
            throw new QuizException(errors.toString());
    }

    private void validateIncorrectAnswers(List<?> myIncorrectAnswers, boolean onUpdate,
                                          Long quizNuggetId) throws QuizException {
        HashMap<String, String> errors = new HashMap<>();
        if (myIncorrectAnswers.size()<3)
            errors.put("Size", "At least 3 incorrect answers should be provided");
        int i = 0;
        for (Object myIncorrectAnswer : myIncorrectAnswers) {
            if (! (myIncorrectAnswer instanceof HashMap<?, ?>)) {
                errors.put("IncorrectAnswer", String.format("Incorrect answer on pos %d has wrong type", i));
                throw new QuizException(errors.toString());
            }
            try {
                this.validateIncorrectAnswer((HashMap<String, Object>) myIncorrectAnswer, onUpdate, quizNuggetId);
            }catch (QuizHandler.QuizException exc) {
                errors.put(String.format("IncorrectAnswer%d", i),exc.getMessage());
            }
            i++;
        }
        if (!errors.isEmpty())
            throw new QuizException(errors.toString());
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
                throw new QuizException(String.format("Incorrect-answer with id: %d does not exist",
                        (int) myIncorrectAnswer.get(this.QN_ID)));
        }
    }

    public class QuizException extends Exception {
        public QuizException() { super(); }
        public QuizException(String message) { super(message); }

        @Override
        public String toString() { return String.format("QuizException: %s", this.getMessage()); }
    }
}
