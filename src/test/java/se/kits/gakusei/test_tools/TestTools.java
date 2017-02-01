package se.kits.gakusei.test_tools;

import se.kits.gakusei.content.model.Fact;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.dto.QuestionDTO;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class TestTools {

    public static List<Nugget> generateNuggets() {
        List<Nugget> nuggets = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            Nugget n = new Nugget("verb");
            Fact f1 = new Fact();
            f1.setType("swedish");
            f1.setData("swe_test" + i);
            f1.setNugget(n);
            Fact f2 = new Fact();
            f2.setType("english");
            f2.setData("eng_test" + i);
            f2.setNugget(n);
            n.setFacts(new ArrayList<Fact>(Arrays.asList(f1, f2)));
            if (i % 3 == 0) {
                n.setHidden(true);
            }
            nuggets.add(n);
        }
        return nuggets;
    }

    public static Nugget generateQuizNugget(String description, String correctData, String incorrectData) {
        Nugget n = new Nugget("quiz");
        n.setDescription(description);
        Fact correctFact = new Fact();
        correctFact.setType("correct");
        correctFact.setData(correctData);
        correctFact.setNugget(n);
        List<Fact> facts = new ArrayList<>();
        facts.add(correctFact);
        for (int i = 0; i < 5; i++) {
            Fact incorrectFact = new Fact();
            incorrectFact.setType("incorrect");
            incorrectFact.setData(incorrectData + i);
            incorrectFact.setNugget(n);
            facts.add(incorrectFact);
        }
        n.setFacts(facts);
        return n;
    }

    public static Lesson generateQuizLesson(String lessonName, String description, String correctData, String incorrectData) {
        Lesson lesson = new Lesson();
        lesson.setName(lessonName);
        List<Nugget> nuggets = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            Nugget n = generateQuizNugget(description, correctData, incorrectData);
            n.setLessons(Collections.singletonList(lesson));
            nuggets.add(n);
        }
        return lesson;
    }

    public static QuestionDTO generateQuestionDTO() {
        List<String> question = new ArrayList<>();
        question.add("question");
        String alt1 = "alternative1";
        String alt2 = "alternative2";
        String alt3 = "alternative3";
        String altCorrect = "alternativeCorrect";
        QuestionDTO dto = new QuestionDTO();
        dto.setQuestion(question);
        dto.setAlternative1(alt1);
        dto.setAlternative2(alt2);
        dto.setAlternative3(alt3);
        dto.setCorrectAlternative(altCorrect);
        return dto;
    }
}
