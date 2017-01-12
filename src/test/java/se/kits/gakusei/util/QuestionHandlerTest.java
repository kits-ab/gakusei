package se.kits.gakusei.util;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import se.kits.gakusei.content.model.Fact;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.dto.QuestionDTO;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RunWith(MockitoJUnitRunner.class)
public class QuestionHandlerTest {

    @Captor
    ArgumentCaptor<Nugget> nuggetCaptor;

    @Captor
    ArgumentCaptor<List<Nugget>> listCaptor;

    @Captor
    ArgumentCaptor<String> questionTypeCaptor;

    @Captor
    ArgumentCaptor<String> answerTypeCaptor;

    List<Nugget> nuggets;
    String questionType;
    String answerType;
    QuestionHandler questionHandler;

    @Before
    public void setUp() throws Exception {
        nuggets = generateNuggets();
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

    // Helper method to get a list of nuggets
    private List<Nugget> generateNuggets() {
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

}
