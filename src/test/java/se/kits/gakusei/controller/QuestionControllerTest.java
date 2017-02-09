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
import org.springframework.http.ResponseEntity;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.NuggetRepository;
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
    private NuggetRepository nuggetRepository;

    @Mock
    private QuestionHandler questionHandler;

    @Mock
    private LessonRepository lessonRepository;

    private String wordType;
    private String questionType;
    private String answerType;
    private List<Nugget> nuggets;
    private HashMap<String, Object> dto;

    @Before
    public void setUp() throws Exception {
        questionController = new QuestionController();
        MockitoAnnotations.initMocks(this);

        questionType = "reading";
        answerType = "swedish";
        nuggets = TestTools.generateNuggets();
        dto = TestTools.generateQuestionDTO();
        Mockito.when(questionHandler.createOneQuestion(nuggets, questionType, answerType)).thenReturn(dto);
    }

    @Test
    public void testGetQuestionWithoutWordType() throws Exception {
        wordType = "";

        Mockito.when(nuggetRepository.getNuggetsWithoutWordType(questionType, answerType)).thenReturn(nuggets);

        ResponseEntity<HashMap<String, Object>> re = questionController.getQuestion(wordType, questionType, answerType);

        assertEquals(dto, re.getBody());
        assertEquals(200, re.getStatusCodeValue());
    }

    @Test
    public void testGetQuestionWithWordType() throws Exception {
        wordType = "verb";

        Mockito.when(nuggetRepository.getNuggetsWithWordType(wordType, questionType, answerType)).thenReturn(nuggets);

        ResponseEntity<HashMap<String, Object>> re = questionController.getQuestion(wordType, questionType, answerType);

        assertEquals(dto, re.getBody());
        assertEquals(200, re.getStatusCodeValue());
    }

    @Test
    public void testGetQuestionReturnNoContent() throws Exception {
        wordType = "";

        Mockito.when(nuggetRepository.getNuggetsWithoutWordType(questionType, answerType)).thenReturn(nuggets);
        Mockito.when(questionHandler.createOneQuestion(nuggets, questionType, answerType)).thenReturn(null);

        ResponseEntity<HashMap<String, Object>> re = questionController.getQuestion(wordType, questionType, answerType);

        assertNull(re.getBody());
        assertEquals(204, re.getStatusCodeValue());
    }

    @Test
    public void testGetQuestionsFromLessonOK() throws Exception {
        String lesson = "Verbs";
        List<HashMap<String, Object>> dtoList = Collections.singletonList(dto);

        Mockito.when(lessonRepository.findNuggetsByTwoFactTypes(lesson, questionType, answerType)).thenReturn(nuggets);
        Mockito.when(questionHandler.createManyQuestions(nuggets, questionType, answerType)).thenReturn(dtoList);

        ResponseEntity<List<HashMap<String, Object>>> re = questionController.getQuestionsFromLesson(lesson, questionType, answerType);

        assertEquals(dtoList, re.getBody());
        assertEquals(200, re.getStatusCodeValue());
    }

    @Test
    public void testGetQuestionsFromLessonInternalServerError() throws Exception {
        String lesson = "Verbs";
        List<HashMap<String, Object>> emptyList = Collections.EMPTY_LIST;

        Mockito.when(lessonRepository.findNuggetsByTwoFactTypes(lesson, questionType, answerType)).thenReturn(nuggets);
        Mockito.when(questionHandler.createManyQuestions(nuggets, questionType, answerType)).thenReturn(emptyList);

        ResponseEntity<List<HashMap<String, Object>>> re = questionController.getQuestionsFromLesson(lesson, questionType, answerType);

        assertNull(re.getBody());
        assertEquals(500, re.getStatusCodeValue());
    }
}
