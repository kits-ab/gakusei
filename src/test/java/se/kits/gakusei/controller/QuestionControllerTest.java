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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.UserLessonRepository;
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

    @Mock
    private UserLessonRepository userLessonRepository;

    @Value("${gakusei.questions-quantity}")
    private int quantity;

    private String questionType;
    private String answerType;
    private String lessonName;
    private String userName;
    private List<Nugget> nuggets;
    private Lesson lesson;
    private List<HashMap<String, Object>> questionList;

    @Before
    public void setUp() throws Exception {
        questionController = new QuestionController(lessonRepository, questionHandler, userLessonRepository);
        MockitoAnnotations.initMocks(this);
        questionType = "reading";
        answerType = "swedish";
        lessonName = "Verbs";
        userName = "testUser";
        nuggets = TestTools.generateNuggets();
        lesson = new Lesson();
        lesson.setName(lessonName);
        lesson.setNuggets(nuggets);
        questionList = Collections.singletonList(TestTools.generateQuestion());
    }



    @Test
    public void testGetQuestionsFromLessonOK() throws Exception {
        Mockito.when(lessonRepository.findNuggetsByRetentionDate(userName, lessonName)).thenReturn(nuggets);
        Mockito.when(lessonRepository.findNuggetsBySuccessrate(userName, lessonName)).thenReturn(nuggets);
        Mockito.when(lessonRepository.findUnansweredNuggets(userName, lessonName)).thenReturn(nuggets);
        Mockito.when(lessonRepository.findByName(lessonName)).thenReturn(lesson);
        Mockito.when(questionHandler.chooseNuggets(nuggets, nuggets, nuggets, nuggets, quantity, false)).thenReturn(nuggets);
        Mockito.when(questionHandler.createQuestions(nuggets, questionType, answerType))
                .thenReturn(questionList);

        ResponseEntity<List<HashMap<String, Object>>> re = questionController.getQuestionsFromLesson(lessonName,
                "vocabulary", questionType, answerType, userName, false);

        assertEquals(questionList, re.getBody());
        assertEquals(HttpStatus.OK, re.getStatusCode());
    }

    @Test
    public void testGetQuestionsFromLessonInternalServerError() throws Exception {
        questionList = Collections.EMPTY_LIST;

        Mockito.when(lessonRepository.findNuggetsBySuccessrate(userName, lessonName)).thenReturn(nuggets);
        Mockito.when(lessonRepository.findUnansweredNuggets(userName, lessonName)).thenReturn(nuggets);
        Mockito.when(lessonRepository.findByName(lessonName)).thenReturn(lesson);
        Mockito.when(questionHandler.chooseNuggets(nuggets, nuggets, nuggets, nuggets, quantity, false)).thenReturn(nuggets);
        Mockito.when(questionHandler.createQuestions(nuggets, questionType, answerType))
                .thenReturn(questionList);

        ResponseEntity<List<HashMap<String, Object>>> re = questionController.getQuestionsFromLesson(lessonName,
                "vocabulary", questionType, answerType, userName, false);

        assertNull(re.getBody());
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, re.getStatusCode());
    }
}
