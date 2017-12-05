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
    private String questionType;
    private String answerType;
    private QuestionHandler questionHandler;
    private List<Nugget> visibleNuggets;

    @Before
    public void setUp() throws Exception {
        nuggets = TestTools.generateNuggets();
        questionType = "swedish";
        answerType = "english";
        questionHandler = new QuestionHandler();
        visibleNuggets = nuggets.stream().filter(n -> !n.isHidden()).collect(Collectors.toList());

    }

    @Test
    public void testCreateQuestions() throws Exception {
        List<HashMap<String, Object>> questions = questionHandler.createQuestions(nuggets, questionType, answerType);

        assertFalse(questions.stream().anyMatch(q -> q == null));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("question")).get(0).startsWith("swe_test")));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("alternative1")).get(0).startsWith("eng_test")));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("alternative2")).get(0).startsWith("eng_test")));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("alternative3")).get(0).startsWith("eng_test")));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("correctAlternative")).get(0).startsWith("eng_test")));
    }

    @Test
    public void testCreateQuestion() throws Exception {
        Nugget nugget = visibleNuggets.get(0);

        HashMap<String, Object> dto = questionHandler.createQuestion(nugget, visibleNuggets, questionType, answerType);

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
        List<Nugget> tooFewNuggets = visibleNuggets.subList(0, 2);
        Nugget nugget = tooFewNuggets.get(0);

        HashMap<String, Object> dto = questionHandler.createQuestion(nugget, tooFewNuggets, questionType, answerType);

        assertNull(dto);
    }

    @Test
    public void testChooseNuggets() {
        int quantity = 5;
        List<Nugget> chosen = questionHandler.chooseNuggets(visibleNuggets, visibleNuggets, visibleNuggets, quantity);
        assertTrue(visibleNuggets.size() >= quantity ? chosen.size() == quantity : chosen.size() == visibleNuggets
                .size());
    }
}
