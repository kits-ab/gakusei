package se.kits.gakusei.util;

import org.springframework.stereotype.Component;
import se.kits.gakusei.content.model.Fact;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.dto.QuestionDTO;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class QuestionHandler {

    public QuestionDTO getQuestion(List<Nugget> nuggets, String questionType, String answerType) {
        Random random = new Random();
        List<Nugget> notHiddenNuggets = nuggets.stream().filter(n -> isNotHidden(n)).collect(Collectors.toList());
        Nugget nugget = notHiddenNuggets.get(random.nextInt(notHiddenNuggets.size()));
        return createQuestion(nugget, notHiddenNuggets, questionType, answerType);
    }

    public List<QuestionDTO> getQuestions(List<Nugget> nuggets, String questionType, String answerType) {
        List<Nugget> notHiddenNuggets = nuggets.stream().filter(n -> isNotHidden(n)).collect(Collectors.toList());
        List<QuestionDTO> questions = notHiddenNuggets.stream()
                .map(n -> createQuestion(n, notHiddenNuggets, questionType, answerType))
                .collect(Collectors.toList());
        Collections.shuffle(questions);
        return questions;
    }

    private QuestionDTO createQuestion(Nugget nugget, List<Nugget> nuggets, String questionType, String answerType) {
        if (nuggets.size() >= 4) {
            List<Nugget> shuffledNuggets = new LinkedList<>(nuggets);
            Collections.shuffle(shuffledNuggets);
            shuffledNuggets.remove(nugget);
            List<Nugget> alternativesNuggets = shuffledNuggets.subList(0, 4);
            List<String> alternatives = new ArrayList<>();
            QuestionDTO question = new QuestionDTO();

            question.setQuestion(nugget.getFacts().stream().filter(f -> f.getType()
                    .equals(questionType)).findFirst().orElse(null).getData());

            question.setCorrectAlternative(nugget.getFacts().stream().filter(f -> f.getType()
                    .equals(answerType)).findFirst().orElse(null).getData());

            alternativesNuggets.forEach(n -> alternatives.add(n.getFacts().stream().filter(f -> f.getType()
                    .equals(answerType)).findFirst().orElse(null).getData()));
            question.setAlternative1(alternatives.get(0));
            question.setAlternative2(alternatives.get(1));
            question.setAlternative3(alternatives.get(2));
            return question;
        } else {
            return null;
        }
    }

    private boolean isNotHidden(Nugget nugget) {
        List<Boolean> boolList = nugget.getFacts().stream()
                .map(f -> f.getType().equals("state") && f.getData().equals("hidden"))
                .collect(Collectors.toList());
        return !boolList.contains(true);
    }
}
