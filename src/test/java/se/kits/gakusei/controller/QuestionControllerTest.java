package se.kits.gakusei.controller;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.test_tools.TestTools;
import se.kits.gakusei.util.QuestionHandler;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@RunWith(MockitoJUnitRunner.class)
public class QuestionControllerTest {

    @InjectMocks
    private QuestionController questionController;

    @Mock
    private QuestionHandler questionHandler;

    @Mock
    private LessonRepository lessonRepository;

   @Value("${gakusei.questions-quantity}")
    private int quantity;

    private String questionType;
    private String answerType;
    private List<Nugget> nuggets;

    @Before
    public void setUp() throws Exception {
        questionController = new QuestionController();
        MockitoAnnotations.initMocks(this);
        questionType = "reading";
        answerType = "swedish";
        nuggets = TestTools.generateNuggets();
    }

    @Test
    public void testGetQuestionsFromLessonOK() throws Exception {
        String lesson = "Verbs";
        List<HashMap<String, Object>> questionList = Collections.singletonList(TestTools.generateQuestion());

        Mockito.when(lessonRepository.findNuggetsByTwoFactTypes(lesson, questionType, answerType)).thenReturn(nuggets);
        Mockito.when(questionHandler.createQuestions(nuggets, quantity, questionType, answerType))
                .thenReturn(questionList);

        ResponseEntity<List<HashMap<String, Object>>> re = questionController.getQuestionsFromLesson(lesson,
                questionType, answerType);

        assertEquals(questionList, re.getBody());
        assertEquals(200, re.getStatusCodeValue());
    }

    @Test
    public void testGetQuestionsFromLessonInternalServerError() throws Exception {
        String lesson = "Verbs";
        List<HashMap<String, Object>> emptyList = Collections.EMPTY_LIST;

        Mockito.when(lessonRepository.findNuggetsByTwoFactTypes(lesson, questionType, answerType)).thenReturn(nuggets);
        Mockito.when(questionHandler.createQuestions(nuggets, quantity, questionType, answerType))
                .thenReturn(emptyList);

        ResponseEntity<List<HashMap<String, Object>>> re = questionController.getQuestionsFromLesson(lesson,
                questionType, answerType);

        assertNull(re.getBody());
        assertEquals(500, re.getStatusCodeValue());
    }
}
