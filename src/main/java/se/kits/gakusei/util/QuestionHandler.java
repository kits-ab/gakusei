package se.kits.gakusei.util;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import se.kits.gakusei.content.model.*;
import se.kits.gakusei.content.repository.GrammarTextRepository;
import se.kits.gakusei.content.repository.InflectionRepository;
import se.kits.gakusei.content.repository.NuggetRepository;
import se.sandboge.japanese.conjugation.Verb;

@Component
public class QuestionHandler {
    @Autowired
    GrammarTextRepository grammarTextRepository;

    @Autowired
    InflectionRepository inflectionRepository;

    @Autowired
    ProgressHandler progressHandler;

    @Autowired
    NuggetRepository nuggetRepository;

    public List<HashMap<String, Object>> createQuestions(
        List<Nugget> nuggets,
        String questionType,
        String answerType
    ) {
        List<HashMap<String, Object>> questions = nuggets.stream().map(
            n -> createQuestion(n, nuggets, questionType, answerType)
        ).filter(Objects::nonNull).collect(Collectors.toList());
        return questions;
    }

    public List<HashMap<String, Object>> createSpacedRepetitionQuestions(
        List<Nugget> retentionNuggets,
        List<Nugget> allLessonNuggets,
        String questionType,
        String answerType
    ) {
        List<HashMap<String, Object>> questions = retentionNuggets.stream().map(
            n -> createQuestion(n, allLessonNuggets, questionType, answerType)
        ).filter(Objects::nonNull).collect(Collectors.toList());
        return questions;
    }

    protected HashMap<String, Object> createQuestion(
        Nugget nugget,
        List<Nugget> nuggets,
        String questionType,
        String answerType
    ) {
        HashMap<String, Object> questionMap = new HashMap<>();
        LinkedList<Nugget> optimalNuggets = new LinkedList<>();
        List<Nugget> copyOfNuggets = new ArrayList<>(nuggets);
        copyOfNuggets.remove(nugget);
        Collections.shuffle(copyOfNuggets);

        List<List<String>> correctAlternative = new ArrayList<>();
        correctAlternative.add(createAlternative(nugget, answerType));

        for (int i = 0; optimalNuggets.size() < 3 && i < copyOfNuggets.size(); i++) {
            if (copyOfNuggets.get(i).getWordType().equals(
                nugget.getWordType()
            )) {
                optimalNuggets.push(copyOfNuggets.get(i));
            } else if (copyOfNuggets.size() - i + 1 <= 4 - optimalNuggets.size(

            )) {
                optimalNuggets.push(copyOfNuggets.get(i));
            }
        }
        List<List<String>> incorrectAlternatives = new ArrayList<>(
            optimalNuggets.stream().map(
                n -> createAlternative(n, answerType)
            ).collect(Collectors.toList())
        );
        //Naive way of checking for synonyms.
        correctAlternative.addAll(
            optimalNuggets.stream().filter(
                n -> n.getSwedish().equals(nugget.getSwedish()) || (n.getJpRead(

                ).equals(nugget.getJpRead()) && n.getJpWrite().equals(
                    nugget.getJpWrite()
                ))
            ).map(n -> createAlternative(n, answerType)).collect(
                Collectors.toList()
            )
        );

        if (incorrectAlternatives.size() == 3) {
            List<String> question = createAlternative(nugget, questionType);
            questionMap.put("question", question);
            questionMap.put("correctAlternative", correctAlternative);
            questionMap.put("alternative1", incorrectAlternatives.get(0));
            questionMap.put("alternative2", incorrectAlternatives.get(1));
            questionMap.put("alternative3", incorrectAlternatives.get(2));
            questionMap.put("questionNuggetId", nugget.getId());
            return questionMap;
        } else {
            return null;
        }
    }

    public List<HashMap<String, Object>> createGrammarQuestions(
        Lesson lesson,
        List<Nugget> nuggets,
        String questionType,
        String answerType
    ) {
        return nuggets.stream().map(
            n -> createGrammarQuestion(lesson, n, questionType, answerType)
        ).filter(Objects::nonNull).collect(Collectors.toList());
    }

    private HashMap<String, Object> createGrammarQuestion(
        Lesson lesson,
        Nugget nugget,
        String questionType,
        String answerType
    ) {
        HashMap<String, Object> questionMap = new HashMap<>();
        List<Inflection> inflections = inflectionRepository.findByLessonId(
            lesson.getId()
        );
        Collections.shuffle(inflections); // Get "random" inflection
        Inflection selectedInflection = inflections.get(0);
        List<
            GrammarText
        > grammarTexts = grammarTextRepository.findByInflectionMethod(
            selectedInflection.getInflectionMethod()
        );
        List<String> question = createAlternative(nugget, questionType);
        if (!grammarTexts.isEmpty()) {
            question.add(grammarTexts.get(0).getSeShort());
            question.addAll(createAlternative(nugget, answerType));
            questionMap.put("explanationText", grammarTexts.get(0).getSeLong());
        } else {
            question.add(selectedInflection.getInflectionMethod());
            question.addAll(createAlternative(nugget, answerType));
        }
        String inflectedVerb = inflectVerb(selectedInflection, question.get(1));
        if (inflectedVerb == null) {
            return null;
        }
        questionMap.put("question", question);
        questionMap.put(
            "correctAlternative",
            Collections.singletonList(inflectedVerb)
        );
        questionMap.put("alternative1", Collections.EMPTY_LIST);
        questionMap.put("alternative2", Collections.EMPTY_LIST);
        questionMap.put("alternative3", Collections.EMPTY_LIST);
        questionMap.put("questionNuggetId", nugget.getId());

        return questionMap;
    }

    private String inflectVerb(Inflection inflection, String baseVerb) {
        try {
            Verb verb = new Verb(baseVerb);
            Method methodToInvoke = verb.getClass().getMethod(
                inflection.getInflectionMethod()
            );
            String inflectedVerb = (String) methodToInvoke.invoke(verb);
            return inflectedVerb;
        } catch(
            NoSuchMethodException |
            InvocationTargetException |
            IllegalAccessException |
            IllegalArgumentException e
        ) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Nugget> chooseRetentionNuggets(
        List<Nugget> retentionNuggets,
        List<Nugget> unansweredNuggets,
        int quantity
    ) {
        List<Nugget> visibleNuggets;
        List<Nugget> nuggets = new ArrayList<>();
        nuggets.addAll(retentionNuggets);
        Collections.shuffle(unansweredNuggets);
        nuggets.addAll(unansweredNuggets);
        visibleNuggets = nuggets.stream().filter(
            nugget -> !nugget.isHidden()
        ).distinct().collect(Collectors.toList());


        return visibleNuggets.subList(0, Math.min(visibleNuggets.size(), quantity));
    }

    public List<Nugget> chooseNuggets(
        List<Nugget> nuggetsWithLowSuccessrate,
        List<Nugget> unansweredNuggets,
        List<Nugget> allLessonNuggets,
        int quantity
    ) {
        List<Nugget> visibleNuggets;
        List<Nugget> nuggets = new ArrayList<>();
        if (allLessonNuggets.size() <= quantity) {
            return allLessonNuggets;
        } else {
            nuggets.addAll(unansweredNuggets);
            nuggets.addAll(nuggetsWithLowSuccessrate);
            nuggets.addAll(allLessonNuggets);
            visibleNuggets = nuggets.stream().filter(
                nugget -> !nugget.isHidden()
            ).distinct().collect(Collectors.toList());
            Collections.shuffle(visibleNuggets);
        }
        return visibleNuggets.subList(0, Math.min(nuggets.size(), quantity));
    }

    private List<String> createAlternative(Nugget nugget, String type) {
        List<String> alternative = new ArrayList<>();
        try {
            if (type.equals("reading")) {
                // reading -> japanese
                alternative.add(nugget.getJpRead());
                alternative.add(nugget.getJpWrite());
            } else {
                String methodName = "get" + Character.toString(
                    Character.toUpperCase(type.charAt(0))
                ) + type.substring(1);
                alternative.add(
                    (String) nugget.getClass().getMethod(methodName).invoke(
                        nugget
                    )
                );
            }
        } catch(
            NoSuchMethodException |
            IllegalAccessException |
            InvocationTargetException e
        ) {
            e.printStackTrace();
        }
        return alternative;
    }

    //skapar createWrongAnswersQuestions
    public List<HashMap<String, Object>> wrongAnswers(String username, String lessonType, String questionType, String answerType){
        List<Nugget> wrongNuggets = progressHandler.getWrongAnswers(username, lessonType);
        //skapar frågorna med wrongNuggets som utgångspunkt
        List<HashMap<String, Object>> questions = wrongNuggets.stream().map(
                n -> createQuestion(n, wrongNuggets, questionType, answerType)
        ).filter(Objects::nonNull).collect(Collectors.toList());
        Collections.shuffle(wrongNuggets);
        return questions.subList(0, Math.min(questions.size(), 20));//Hardcoded max amount questions


    }

}

