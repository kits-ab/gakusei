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
        List<Nugget> notHiddenNuggets = nuggets.stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
        Nugget nugget = notHiddenNuggets.get(random.nextInt(notHiddenNuggets.size()));
        return createQuestion(nugget, notHiddenNuggets, questionType, answerType);
    }

    public List<QuestionDTO> getQuestions(List<Nugget> nuggets, String questionType, String answerType) {
        List<Nugget> notHiddenNuggets = nuggets.stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
        List<QuestionDTO> questions = notHiddenNuggets.stream()
                .map(n -> createQuestion(n, notHiddenNuggets, questionType, answerType))
                .collect(Collectors.toList());
        Collections.shuffle(questions);
        return questions;
    }

    protected QuestionDTO createQuestion(Nugget nugget, List<Nugget> nuggets, String questionType, String answerType) {
        LinkedList<Nugget> shuffledNuggets = new LinkedList<>(nuggets);
        shuffledNuggets.remove(nugget);
        Collections.shuffle(shuffledNuggets);
        QuestionDTO question = new QuestionDTO();
        List<String> alternatives = new ArrayList<>();
        alternatives.add(nugget.getFacts().stream().filter(f -> f.getType()
                .equals(answerType)).findFirst().get().getData());

        //Avoid getting the same alternative from another nugget
        while (alternatives.size() < 4 && !shuffledNuggets.isEmpty()) {
            String tempAlternative = shuffledNuggets.poll().getFacts().stream().filter(f -> f.getType()
                    .equals(answerType)).findFirst().get().getData();
            if (!alternatives.contains(tempAlternative)) {
                alternatives.add(tempAlternative);
            }
        }
        if (alternatives.size() == 4) {
            List<String> questions = new ArrayList<>();
            questions.add(nugget.getFacts().stream().filter(f -> f.getType()
                    .equals(questionType)).findFirst().get().getData());
            //Add writing if questionType is reading
            if (questionType.equals("reading")) {
                Fact tempFact = nugget.getFacts().stream().filter(f -> f.getType()
                        .equals("writing")).findFirst().orElse(null);
                if (tempFact != null) {
                    questions.add(tempFact.getData());
                }
            }
            question.setQuestion(questions);
            question.setCorrectAlternative(alternatives.get(0));
            question.setAlternative1(alternatives.get(1));
            question.setAlternative2(alternatives.get(2));
            question.setAlternative3(alternatives.get(3));
            return question;
        } else {
            return null;
        }
    }
}
