package se.kits.gakusei.test_tools;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import se.kits.gakusei.content.model.*;

import java.util.*;

public class TestTools {

    public static List<Nugget> generateNuggets() {
        List<Nugget> nuggets = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            Nugget n = new Nugget("verb");
            n.setId("nuggetid" + i);
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

    public static HashMap<String, Object> generateQuestion() {
        List<String> question = new ArrayList<>();
        question.add("question");
        List<String> alt1 = Arrays.asList("alternative1");
        List<String> alt2 = Arrays.asList("alternative2");
        List<String> alt3 = Arrays.asList("alternative3");
        List<String> altCorrect = Arrays.asList("alternativeCorrect");
        HashMap<String, Object> dto = new HashMap<>();
        dto.put("question", question);
        dto.put("alternative1", alt1);
        dto.put("alternative2", alt2);
        dto.put("alternative3", alt3);
        dto.put("correctAlternative", altCorrect);
        return dto;
    }

    public static List<Course> generateCourses(){
        List<Course> courses = new ArrayList<>();

        for(int i = 1; i <= 10; i++){
            courses.add(createCourse(Integer.toString(i)));
        }

        return courses;
    }

    public static Course generateCourse(){
        return createCourse("");
    }

    private static Course createCourse(String suffix){
        Course course = new Course();
        course.setName("Test course" + suffix);
        course.setCourseCode("TC");
        return course;
    }

    public static List<Quiz> generateQuizzes(int nbrOfQuizzes, String namePrefix, String descrPrefix) {
        List<Quiz> quizzes = new ArrayList<>();
       for (int i = 0; i <= nbrOfQuizzes; i++ ) {
           quizzes.add(createQuiz(Integer.toString(i), namePrefix, descrPrefix));
       }

       return quizzes;
    }

    private static Quiz createQuiz(String suffix, String namePrefix, String descrPrefix) {
        Quiz quiz = new Quiz();
        quiz.setName(namePrefix + suffix);
        quiz.setDescription(descrPrefix + suffix);
        return quiz;
    }

    public static Page<Quiz> generateQuizzesPage(List<Quiz> quizzes, Pageable pageRequest) {
        Page<Quiz> page = new PageImpl<>(quizzes, pageRequest, quizzes.size());
        return page;
    }
}
