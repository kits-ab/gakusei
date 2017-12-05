package se.kits.gakusei.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import se.kits.gakusei.content.model.Inflection;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.InflectionRepository;
import se.sandboge.japanese.conjugation.Verb;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class QuestionHandler {

    @Autowired
    InflectionRepository inflectionRepository;

    public List<HashMap<String, Object>> createQuestions(List<Nugget> nuggets, String questionType, String answerType) {
        List<HashMap<String, Object>> questions = nuggets.stream()
                .map(n -> createQuestion(n, nuggets, questionType, answerType))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        return questions;
    }

    protected HashMap<String, Object> createQuestion(Nugget nugget,
                                                     List<Nugget> nuggets,
                                                     String questionType,
                                                     String answerType) {
        LinkedList<Nugget> optimalNuggets = new LinkedList<>();

        LinkedList<Nugget> allNuggets = new LinkedList<>(nuggets);
        Collections.shuffle(allNuggets);
        allNuggets.remove(nugget);

        List<List<String>> alternatives = new ArrayList<>();
        alternatives.add(createAlternative(nugget, answerType));
        HashMap<String, Object> questionMap = new HashMap<>();

        for(int i = 0; optimalNuggets.size() < 3 && i < allNuggets.size(); i++) {
            if(allNuggets.get(i).getType().equals(nugget.getType()))
                optimalNuggets.push(allNuggets.get(i));
            else if(allNuggets.size() - (i + 1) <= 4 - optimalNuggets.size())
                optimalNuggets.push(allNuggets.get(i));
        }

        //Avoid getting the same alternative from another nugget
        while (alternatives.size() < 4 && !optimalNuggets.isEmpty()) {
            List<String> tempAlternative = createAlternative(optimalNuggets.poll(), answerType);
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
            questionMap.put("questionNuggetId", nugget.getId());
            return questionMap;
        } else {
            return null;
        }
    }

    public List<HashMap<String, Object>> createGrammarQuestions(Lesson lesson,
                                                                List<Nugget> nuggets,
                                                                String questionType,
                                                                String answerType){
        return nuggets.stream().
                map(n -> createGrammarQuestion(lesson, n, questionType, answerType)).
                filter(Objects::nonNull).
                collect(Collectors.toList());
    }

    private HashMap<String, Object> createGrammarQuestion(Lesson lesson,
                                                          Nugget nugget,
                                                          String questionType,
                                                          String answerType){
        HashMap<String, Object> questionMap = new HashMap<>();

        List<Inflection> inflections = inflectionRepository.findByLessonId(lesson.getId());
        Collections.shuffle(inflections); // Get "random" inflection
        Inflection selectedInflection = inflections.get(0);

        List<String> question = createAlternative(nugget, questionType);
        List<String> inflectionInfo = InflectionUtil.getInflectionNameAndTextLink(selectedInflection.getInflectionMethod());

        question.add(inflectionInfo.get(0));
        question.addAll(createAlternative(nugget, answerType));
        if(inflectionInfo.get(1) != null){
            question.add(inflectionInfo.get(1));
        }

        String inflectedVerb = inflectVerb(selectedInflection, question.get(1));
        if(inflectedVerb == null){
            return null;
        }

        questionMap.put("question", question);
        questionMap.put("correctAlternative", Collections.singletonList(inflectedVerb));
        questionMap.put("alternative1", Collections.EMPTY_LIST);
        questionMap.put("alternative2", Collections.EMPTY_LIST);
        questionMap.put("alternative3", Collections.EMPTY_LIST);
        questionMap.put("questionNuggetId", nugget.getId());

        return questionMap;
    }

    private String inflectVerb(Inflection inflection, String baseVerb){
        try {
            Verb verb = new Verb(baseVerb);
            Method methodToInvoke = verb.getClass().getMethod(inflection.getInflectionMethod());
            String inflectedVerb = (String) methodToInvoke.invoke(verb);
            return inflectedVerb;
        } catch (NoSuchMethodException
                | InvocationTargetException
                | IllegalAccessException
                | IllegalArgumentException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Nugget> chooseNuggets(List<Nugget> nuggetsWithLowSuccessrate,
                                                List<Nugget> unansweredNuggets,
                                                List<Nugget> allLessonNuggets,
                                                int quantity) {
        List<Nugget> hiddenNuggets = allLessonNuggets.stream().filter(n -> n.isHidden()).collect(Collectors.toList());
        if (allLessonNuggets.size() <= quantity) {
            return allLessonNuggets;
        } else {
            List<Nugget> nuggets = new ArrayList<>();
            Collections.shuffle(unansweredNuggets);
            Collections.shuffle(nuggetsWithLowSuccessrate);
            Collections.shuffle(allLessonNuggets);
            nuggets.addAll(unansweredNuggets);
            nuggets.addAll(nuggetsWithLowSuccessrate);
            nuggets.addAll(allLessonNuggets);

            List<Nugget> questionNuggets = new ArrayList<>();
            while (questionNuggets.size() <= quantity && nuggets.size() != 0) {
                Nugget nugget = nuggets.remove(0);
                if (!questionNuggets.contains(nugget) && !hiddenNuggets.contains(nugget)) {
                    questionNuggets.add(nugget);
                }
            }
            return questionNuggets;
        }
    }

    private List<String> createAlternative(Nugget nugget, String type) {
        List<String> alternative = new ArrayList<>();
        try {
            if (type.equals("reading")) { // reading -> japanese  
                alternative.add(nugget.getJpRead());
                alternative.add(nugget.getJpWrite());
            } else {
                String methodName = "get" + Character.toString(Character.toUpperCase(type.charAt(0))) +
                        type.substring(1);
                alternative.add((String)nugget.getClass().getMethod(methodName).invoke(nugget));
            }

        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }
        return alternative;
    }
}
