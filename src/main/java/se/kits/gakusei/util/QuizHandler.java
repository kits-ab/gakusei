package se.kits.gakusei.util;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import se.kits.gakusei.content.model.IncorrectAnswer;
import se.kits.gakusei.content.model.QuizNugget;
import se.kits.gakusei.content.repository.IncorrectAnswerRepository;
import se.kits.gakusei.content.repository.QuizNuggetRepository;
import se.kits.gakusei.content.repository.QuizRepository;

@Component
public class QuizHandler {
    public final static String QN_ID = "id";
    public final static String QN_QUIZ_REF = "quizRef";
    public final static String QN_QUESTION = "question";
    public final static String QN_CORRECT_ANSWER = "correctAnswer";
    public final static String QN_INCORRECT_ANSWERS = "incorrectAnswers";

    public final static String QN_GA_CORRECT = "correctAlternative";
    public final static String QN_GA_ALTERNATIVE1 = "alternative1";
    public final static String QN_GA_ALTERNATIVE2 = "alternative2";
    public final static String QN_GA_ALTERNATIVE3 = "alternative3";

    public final static String IA_INCORRECT_ANSWERS = "incorrectAnswer";
    public final static String IA_ID = "id";

    @Autowired
    protected QuizRepository quizRepository;

    @Autowired
    protected QuizNuggetRepository quizNuggetRepository;

    @Autowired
    protected IncorrectAnswerRepository incorrectAnswerRepository;

    public List<HashMap<String, Object>> getQuizNuggets(Long quizId) {
        List<QuizNugget> quizNuggets = quizNuggetRepository.findByQuizId(
            quizId
        );
        List<HashMap<String, Object>> myQuizNuggets = new ArrayList<>();
        for (QuizNugget qn : quizNuggets) {
            HashMap<String, Object> myQuizNugget = convertQuizNuggetForGakusei(
                qn
            );
            myQuizNuggets.add(myQuizNugget);
        }
        return myQuizNuggets;
    }

    public HashMap<String, Object> getQuizNugget(Long quizNuggetId) {
        HashMap<String, Object> myQuizNugget = convertQuizNugget(
            quizNuggetRepository.findOne(quizNuggetId)
        );
        myQuizNugget.put(
            QN_INCORRECT_ANSWERS,
            getIncorrectAnswers(quizNuggetId)
        );

        return myQuizNugget;
    }

    public HashMap<String, Object> convertQuizNugget(QuizNugget quizNugget) {
        HashMap<String, Object> myQuizNugget = new HashMap<>();
        myQuizNugget.put(QN_ID, quizNugget.getId());
        myQuizNugget.put(QN_QUIZ_REF, quizNugget.getQuiz().getId());
        myQuizNugget.put(QN_QUESTION, quizNugget.getQuestion());
        myQuizNugget.put(
            QN_CORRECT_ANSWER,
            Arrays.asList(quizNugget.getCorrectAnswer())
        );
        myQuizNugget.put(
            QN_INCORRECT_ANSWERS,
            getIncorrectAnswers(quizNugget.getId())
        );

        return myQuizNugget;
    }

    public HashMap<String, Object> convertQuizNuggetForGakusei(
        QuizNugget quizNugget
    ) {
        HashMap<String, Object> myQuizNugget = new HashMap<>();
        List<IncorrectAnswer> incorrectAnswers = selectIncorrectAnswers(
            quizNugget.getId()
        );
        myQuizNugget.put(
            QN_QUESTION,
            Collections.singletonList(quizNugget.getQuestion())
        );
        myQuizNugget.put(
            QN_GA_CORRECT,
            Collections.singletonList(
                Collections.singletonList(quizNugget.getCorrectAnswer())
            )
        );
        myQuizNugget.put(
            QN_GA_ALTERNATIVE1,
            Collections.singletonList(
                incorrectAnswers.get(0).getIncorrectAnswer()
            )
        );
        myQuizNugget.put(
            QN_GA_ALTERNATIVE2,
            Collections.singletonList(
                incorrectAnswers.get(1).getIncorrectAnswer()
            )
        );
        myQuizNugget.put(
            QN_GA_ALTERNATIVE3,
            Collections.singletonList(
                incorrectAnswers.get(2).getIncorrectAnswer()
            )
        );

        return myQuizNugget;
    }

    private List<HashMap<String, Object>> getIncorrectAnswers(
        Long quizNuggetId
    ) {
        List<HashMap<String, Object>> myIncorrectAnswers = new ArrayList<>();
        List<
            IncorrectAnswer
        > incorrectAnswers = incorrectAnswerRepository.findByQuizNuggetId(
            quizNuggetId
        );
        for (IncorrectAnswer incorrectAnswer : incorrectAnswers)
        myIncorrectAnswers.add(convertIncorrectAnswer(incorrectAnswer));
        return myIncorrectAnswers;
    }

    private HashMap<String, Object> convertIncorrectAnswer(
        IncorrectAnswer incorrectAnswers
    ) {
        HashMap<String, Object> myIncorrectAnswer = new HashMap<>();
        myIncorrectAnswer.put(IA_ID, incorrectAnswers.getId());
        myIncorrectAnswer.put(
            IA_INCORRECT_ANSWERS,
            incorrectAnswers.getIncorrectAnswer()
        );

        return myIncorrectAnswer;
    }

    private List<IncorrectAnswer> selectIncorrectAnswers(Long quizNuggetId) {
        List<
            IncorrectAnswer
        > allIncorrectAnswers = incorrectAnswerRepository.findByQuizNuggetId(
            quizNuggetId
        );
        // Naive randomization
        Collections.shuffle(allIncorrectAnswers);

        return allIncorrectAnswers.subList(0, 3);
    }

}

