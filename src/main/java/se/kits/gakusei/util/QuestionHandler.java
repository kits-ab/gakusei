package se.kits.gakusei.util;

import org.springframework.stereotype.Component;
import se.kits.gakusei.content.model.Fact;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.dto.ResourceReference;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class QuestionHandler {

    public HashMap<String, Object> createOneQuestion(List<Nugget> nuggets, String questionType, String answerType) {
        Random random = new Random();
        List<Nugget> notHiddenNuggets = nuggets.stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
        Nugget nugget = notHiddenNuggets.get(random.nextInt(notHiddenNuggets.size()));
        return createQuestion(nugget, notHiddenNuggets, questionType, answerType);
    }

    public List<HashMap<String, Object>> createManyQuestions(List<Nugget> nuggets, String questionType, String answerType) {
        List<Nugget> notHiddenNuggets = nuggets.stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
        List<HashMap<String, Object>> questions = notHiddenNuggets.stream()
                .map(n -> createQuestion(n, notHiddenNuggets, questionType, answerType))
                .collect(Collectors.toList());
        Collections.shuffle(questions);
        return questions;
    }

    protected HashMap<String, Object> createQuestion(Nugget nugget,
                                                     List<Nugget> nuggets,
                                                     String questionType,
                                                     String answerType) {
        LinkedList<Nugget> shuffledNuggets = new LinkedList<>(nuggets);
        shuffledNuggets.remove(nugget);
        Collections.shuffle(shuffledNuggets);
        HashMap<String, Object> question = createQuestionDTOWithResource(nugget);
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
            question.put("question", questions);
            question.put("correctAlternative", alternatives.get(0));
            question.put("alternative1", alternatives.get(1));
            question.put("alternative2", alternatives.get(2));
            question.put("alternative3", alternatives.get(3));
            return question;
        } else {
            return null;
        }
    }

    public List<HashMap<String, Object>> createQuizQuestions(List<Nugget> nuggets) {
        return nuggets.stream().map(n -> createQuizQuestion(n)).collect(Collectors.toList());
    }

    protected HashMap<String, Object> createQuizQuestion(Nugget nugget) {
        HashMap<String, Object> question = createQuestionDTOWithResource(nugget);
        question.put("question", Collections.singletonList(nugget.getDescription()));
        List<Fact> facts = nugget.getFacts();
        question.put("correctAlternative",
                facts.stream().filter(f -> f.getType().equals("correct")).findFirst().get().getData());
        List<Fact> incorrectAlternatives =
                facts.stream().filter(f -> f.getType().equals("incorrect")).collect(Collectors.toList());
        Collections.shuffle(incorrectAlternatives);
        question.put("alternative1", incorrectAlternatives.get(0).getData());
        question.put("alternative2", incorrectAlternatives.get(1).getData());
        question.put("alternative3", incorrectAlternatives.get(2).getData());
        return question;
    }

    protected HashMap<String, Object> createQuestionDTOWithResource(Nugget nugget) {
        // TODO: Make generic for any type of resource (not only 'kanjidrawing')
        HashMap<String, Object> questionDTO = new HashMap<>();
        Fact fact = nugget.getFacts().stream().filter(f -> f.getType().equals("kanjidrawing")).findFirst().orElse(null);
        if (fact != null) {
            ResourceReference resource = new ResourceReference();
            resource.setType(fact.getType());
            resource.setLocation(fact.getData());
            questionDTO.put("resourceReference", resource);
        }
        return questionDTO;
    }
}
