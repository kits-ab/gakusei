package se.kits.gakusei.util;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.test_tools.TestTools;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RunWith(MockitoJUnitRunner.class)
public class QuestionHandlerTest {

    private List<Nugget> nuggets;
    private int quantity;
    private String questionType;
    private String answerType;
    private QuestionHandler questionHandler;

    @Before
    public void setUp() throws Exception {
        nuggets = TestTools.generateNuggets();
        quantity = 50;
        questionType = "swedish";
        answerType = "english";
        questionHandler = new QuestionHandler();

    }

    @Test
    public void testCreateQuestions() throws Exception {
        List<HashMap<String, Object>> questions = questionHandler.createQuestions(nuggets,
                quantity, questionType, answerType);

        assertEquals(6, questions.size());
        assertFalse(questions.stream().anyMatch(q -> q == null));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("question")).get(0).startsWith("swe_test")));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("alternative1")).get(0).startsWith("eng_test")));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("alternative2")).get(0).startsWith("eng_test")));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("alternative3")).get(0).startsWith("eng_test")));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("correctAlternative")).get(0).startsWith("eng_test")));
    }

    @Test
    public void testCreateQuestion() throws Exception {
        List<Nugget> notHiddenNuggets = nuggets.stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
        Nugget nugget = notHiddenNuggets.get(0);

        HashMap<String, Object> dto = questionHandler.createQuestion(nugget, notHiddenNuggets, questionType, answerType);

        assertTrue(((List<String>) dto.get("question")).get(0).startsWith("swe_test"));
        Stream.of(dto.get("alternative1"),
                dto.get("alternative2"),
                dto.get("alternative3"),
                dto.get("correctAlternative"))
                .forEach(alt -> assertTrue(((List<String>) alt).get(0).startsWith("eng_test")));

        String q = ((List<String>) dto.get("question")).get(0);
        String ca = ((List<String>) dto.get("correctAlternative")).get(0);
        assertEquals(q.charAt(q.length()-1), ca.charAt(ca.length()-1));

        Set<String> ids = new HashSet<>(Arrays.asList(
                dto.get("alternative1").toString(),
                dto.get("alternative2").toString(),
                dto.get("alternative3").toString(),
                dto.get("correctAlternative").toString()
        ));
        assertEquals(4, ids.size());
    }

    @Test
    public void testCreateQuestionNullReturn() throws Exception {
        List<Nugget> notHiddenNuggets =
                nuggets.stream().filter(n -> !n.isHidden()).collect(Collectors.toList()).subList(0, 2);
        Nugget nugget = notHiddenNuggets.get(0);

        HashMap<String, Object> dto = questionHandler.createQuestion(nugget, notHiddenNuggets, questionType, answerType);

        assertNull(dto);
    }

    @Test
    public void testCreateQuizQuestion() throws Exception {
        String correctData = "quiz_correct";
        String incorrectData = "quiz_incorrect";
        String description = "quiz_question";
        Nugget quizNugget = TestTools.generateQuizNugget(description, correctData, incorrectData);
        HashMap<String, Object> question = questionHandler.createQuizQuestion(quizNugget);
        assertEquals(1, ((List<String>) question.get("question")).size());
        assertEquals(description, ((List<String>) question.get("question")).get(0));
        assertEquals(correctData, ((List<String>) question.get("correctAlternative")).get(0));
        assertTrue(((List<String>) question.get("alternative1")).get(0).startsWith(incorrectData));
        assertTrue(((List<String>) question.get("alternative2")).get(0).startsWith(incorrectData));
        assertTrue(((List<String>) question.get("alternative3")).get(0).startsWith(incorrectData));
    }
}
