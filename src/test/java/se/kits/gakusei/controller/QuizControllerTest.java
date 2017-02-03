package se.kits.gakusei.controller;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.ResponseEntity;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.dto.QuestionDTO;
import se.kits.gakusei.test_tools.TestTools;
import se.kits.gakusei.util.QuestionHandler;

import java.util.Collections;
import java.util.List;

@RunWith(MockitoJUnitRunner.class)
public class QuizControllerTest {

    @InjectMocks
    private QuizController quizController;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private QuestionHandler questionHandler;

    private String lessonName;

    @Before
    public void setUp() throws Exception {
        lessonName = "testLesson";
    }

    @Test
    public void testGetQuizQuestions() {
        String correctData = "quiz_correct";
        String incorrectData = "quiz_incorrect";
        String description = "quiz_question";
        Lesson lesson = TestTools.generateQuizLesson(lessonName, description, correctData, incorrectData);
        Mockito.when(lessonRepository.findByName(lessonName)).thenReturn(lesson);
        List<QuestionDTO> dtoList = Collections.singletonList(TestTools.generateQuestionDTO());
        Mockito.when(questionHandler.createQuizQuestions(lesson.getNuggets())).thenReturn(dtoList);
        ResponseEntity<List<QuestionDTO>> re = quizController.getQuizQuestions(lessonName);

        assertEquals(dtoList, re.getBody());
        assertEquals(200, re.getStatusCodeValue());
    }

    @Test
    public void testGetQuizQuestionsLessonNameNull() {
        Mockito.when(lessonRepository.findByName(lessonName)).thenReturn(null);
        ResponseEntity<List<QuestionDTO>> re = quizController.getQuizQuestions(lessonName);
        assertEquals(null, re.getBody());
        assertEquals(500, re.getStatusCodeValue());
    }
}
