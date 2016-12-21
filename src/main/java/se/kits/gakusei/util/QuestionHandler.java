package se.kits.gakusei.util;

import org.springframework.stereotype.Component;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.dto.QuestionDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class QuestionHandler {

    public QuestionDTO createQuestion(List<Nugget> nuggets, String questionType, String answerType) {
        Random random = new Random();
        QuestionDTO question = new QuestionDTO();
        List<String> alternatives = new ArrayList<>();

        if (nuggets.size() >= 4) {
            while (alternatives.size() < 5) {
                Nugget tempNugget = nuggets.remove(random.nextInt(nuggets.size()));
                //if first, use as a question
                if (alternatives.size() == 0) {
                    question.setQuestion(tempNugget.getFacts().stream().filter(f -> f.getType().equals(questionType))
                            .findFirst().orElse(null).getData());
                }
                alternatives.add(tempNugget.getFacts().stream().filter(f -> f.getType().equals(answerType))
                        .findFirst().orElse(null).getData());
            }
        } else {
            return null;
        }

        question.setCorrectAlternative(alternatives.get(0));
        question.setAlternative1(alternatives.get(1));
        question.setAlternative2(alternatives.get(2));
        question.setAlternative3(alternatives.get(3));

        return question;
    }
}
