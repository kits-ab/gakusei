package se.kits.gakusei.util;

import org.springframework.stereotype.Component;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.dto.QuestionDTO;

import java.util.*;

@Component
public class QuestionHandler {

    public QuestionDTO createQuestion(List<Nugget> nuggets, String questionType, String answerType) {
        List<Nugget> shuffledList = new LinkedList<>(nuggets);
        Collections.shuffle(shuffledList);
        List<Nugget> randomNuggets = shuffledList.subList(0, 5);
        List<String> alternatives = new ArrayList<>();
        QuestionDTO question = new QuestionDTO();

        if (nuggets.size() >= 4) {
            question.setQuestion(randomNuggets.get(0).getFacts().stream().filter(f -> f.getType()
                    .equals(questionType)).findFirst().orElse(null).getData());

            randomNuggets.forEach(n -> alternatives.add(n.getFacts().stream().filter(f -> f.getType()
                    .equals(answerType)).findFirst().orElse(null).getData()));

            question.setCorrectAlternative(alternatives.get(0));
            question.setAlternative1(alternatives.get(1));
            question.setAlternative2(alternatives.get(2));
            question.setAlternative3(alternatives.get(3));
        } else {
            return null;
        }

        return question;
    }
}