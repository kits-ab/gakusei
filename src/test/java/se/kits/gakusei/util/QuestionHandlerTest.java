package se.kits.gakusei.util;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.dto.QuestionDTO;
import se.kits.gakusei.test_tools.TestTools;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RunWith(MockitoJUnitRunner.class)
public class QuestionHandlerTest {

    @Captor
    private ArgumentCaptor<Nugget> nuggetCaptor;

    @Captor
    private ArgumentCaptor<List<Nugget>> listCaptor;

    @Captor
    private ArgumentCaptor<String> questionTypeCaptor;

    @Captor
    private ArgumentCaptor<String> answerTypeCaptor;

    private List<Nugget> nuggets;
    private String questionType;
    private String answerType;
    private QuestionHandler questionHandler;

    @Before
    public void setUp() throws Exception {
        nuggets = TestTools.generateNuggets();
        questionType = "swedish";
        answerType = "english";
        questionHandler = new QuestionHandler();

    }

    @Test
    public void testGetQuestion() throws Exception {
        QuestionHandler spyQh;
        spyQh = Mockito.spy(questionHandler);
        spyQh.getQuestion(nuggets, questionType, answerType);
        Mockito.verify(spyQh).createQuestion(
                nuggetCaptor.capture(),
                listCaptor.capture(),
                questionTypeCaptor.capture(),
                answerTypeCaptor.capture());

        assertFalse(nuggetCaptor.getValue().isHidden());
        assertEquals(questionType, questionTypeCaptor.getValue());
        assertEquals(answerType, answerTypeCaptor.getValue());
        assertTrue(listCaptor.getValue().stream().allMatch(n -> !n.isHidden()));
        // 6 non-hidden nuggets are expected from generateNuggets()
        assertEquals(6, listCaptor.getValue().size());
    }

    @Test
    public void testGetQuestions() throws Exception {
        List<QuestionDTO> questions = questionHandler.getQuestions(nuggets, questionType, answerType);

        assertEquals(6, questions.size());
        assertFalse(questions.stream().anyMatch(q -> q == null));
        assertTrue(questions.stream().allMatch(q -> q.getQuestion().startsWith("swe_test")));
        assertTrue(questions.stream().allMatch(q -> q.getAlternative1().startsWith("eng_test")));
        assertTrue(questions.stream().allMatch(q -> q.getAlternative2().startsWith("eng_test")));
        assertTrue(questions.stream().allMatch(q -> q.getAlternative3().startsWith("eng_test")));
        assertTrue(questions.stream().allMatch(q -> q.getCorrectAlternative().startsWith("eng_test")));
    }

    @Test
    public void testCreateQuestion() throws Exception {
        List<Nugget> notHiddenNuggets = nuggets.stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
        Nugget nugget = notHiddenNuggets.get(0);

        QuestionDTO dto = questionHandler.createQuestion(nugget, notHiddenNuggets, questionType, answerType);

        assertTrue(dto.getQuestion().startsWith("swe_test"));
        Stream.of(dto.getAlternative1(), dto.getAlternative2(), dto.getAlternative3(), dto.getCorrectAlternative())
                .forEach(alt -> assertTrue(alt.startsWith("eng_test")));

        String q = dto.getQuestion();
        String ca = dto.getCorrectAlternative();
        assertEquals(q.charAt(q.length()-1), ca.charAt(ca.length()-1));

        Set<String> ids = new HashSet<>(Arrays.asList(dto.getAlternative1(), dto.getAlternative2(), dto.getAlternative3(), dto.getCorrectAlternative()));
        assertEquals(4, ids.size());
    }

    @Test
    public void testCreateQuestionNullReturn() throws Exception {
        List<Nugget> notHiddenNuggets =
                nuggets.stream().filter(n -> !n.isHidden()).collect(Collectors.toList()).subList(0, 2);
        Nugget nugget = notHiddenNuggets.get(0);

        QuestionDTO dto = questionHandler.createQuestion(nugget, notHiddenNuggets, questionType, answerType);

        assertNull(dto);
    }
}
