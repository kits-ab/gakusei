package se.kits.gakusei.util;

import org.springframework.stereotype.Component;
import se.kits.gakusei.content.model.Fact;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.dto.ResourceReference;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class QuestionHandler {

    public List<HashMap<String, Object>> createQuestions(List<Nugget> nuggets,
                                                         int quantity,
                                                         String questionType,
                                                         String answerType) {
        List<Nugget> notHiddenNuggets = nuggets.stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
        List<HashMap<String, Object>> questions = notHiddenNuggets.stream()
                .map(n -> createQuestion(n, notHiddenNuggets, questionType, answerType))
                .collect(Collectors.toList());
        Collections.shuffle(questions);
        if (questions.size() > quantity) {
            return questions.subList(0, quantity);
        }
        return questions;
    }

    protected HashMap<String, Object> createQuestion(Nugget nugget,
                                                     List<Nugget> nuggets,
                                                     String questionType,
                                                     String answerType) {
        HashMap<String, Object> questionMap = createQuestionDTOWithResource(nugget);
        LinkedList<Nugget> shuffledNuggets = new LinkedList<>(nuggets);
        shuffledNuggets.remove(nugget);
        Collections.shuffle(shuffledNuggets);
        List<List<String>> alternatives = new ArrayList<>();
        alternatives.add(createAlternative(nugget, answerType));

        //Avoid getting the same alternative from another nugget
        while (alternatives.size() < 4 && !shuffledNuggets.isEmpty()) {
            List<String> tempAlternative = createAlternative(shuffledNuggets.poll(), answerType);
            if (alternatives.stream().noneMatch(l -> l.get(0).equals(tempAlternative.get(0)))) {
                alternatives.add(tempAlternative);
            }
        }
        if (alternatives.size() == 4) {
            List<String> question = createAlternative(nugget, questionType);
            questionMap.put("question", question);
            questionMap.put("correctAlternative", alternatives.get(0));
            questionMap.put("alternative1", alternatives.get(1));
            questionMap.put("alternative2", alternatives.get(2));
            questionMap.put("alternative3", alternatives.get(3));
            return questionMap;
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
                Collections.singletonList(facts.stream().filter(f -> f.getType().equals("correct"))
                        .findFirst().get().getData()));
        List<Fact> incorrectAlternatives =
                facts.stream().filter(f -> f.getType().equals("incorrect")).collect(Collectors.toList());
        Collections.shuffle(incorrectAlternatives);
        question.put("alternative1", Collections.singletonList(incorrectAlternatives.get(0).getData()));
        question.put("alternative2", Collections.singletonList(incorrectAlternatives.get(1).getData()));
        question.put("alternative3", Collections.singletonList(incorrectAlternatives.get(2).getData()));
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

    public List<Nugget> chooseNuggetsByProgress(List<Nugget> nuggetsWithLowSuccessrate,
                                                List<Nugget> unansweredNuggets,
                                                List<Nugget> allLessonNuggets,
                                                int quantity) {
        List<Nugget> hiddenNuggets = allLessonNuggets.stream().filter(n -> n.isHidden()).collect(Collectors.toList());
        if (allLessonNuggets.size() <= quantity) {
            return allLessonNuggets;
        } else {
            List<Nugget> duplicatedNuggets = new ArrayList<>();
            duplicatedNuggets.addAll(nuggetsWithLowSuccessrate);
            duplicatedNuggets.addAll(unansweredNuggets);
            duplicatedNuggets.addAll(allLessonNuggets);
            Collections.shuffle(duplicatedNuggets);

            List<Nugget> nuggets = new ArrayList<>();
            while (nuggets.size() <= quantity && duplicatedNuggets.size() != 0) {
                Nugget nugget = duplicatedNuggets.remove(0);
                if (!nuggets.contains(nugget) && !hiddenNuggets.contains(nugget)) {
                    nuggets.add(nugget);
                }
            }
            return nuggets;
        }
    }

    private List<String> createAlternative(Nugget nugget, String type) {
        List<String> alternative = new ArrayList<>();
        alternative.add(nugget.getFacts().stream().filter(f -> f.getType().equals(type)).findFirst().get().getData());
        if (type.equals("reading")) {
            Fact tempFact = nugget.getFacts().stream().filter(f -> f.getType().equals("writing"))
                    .findFirst().orElse(null);
            if (tempFact != null) {
                alternative.add(tempFact.getData());
            }
        }
        return alternative;
    }
}
