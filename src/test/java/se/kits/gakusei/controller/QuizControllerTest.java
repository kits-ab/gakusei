package se.kits.gakusei.controller;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Quiz;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.QuizRepository;
import se.kits.gakusei.test_tools.TestTools;
import se.kits.gakusei.util.QuestionHandler;
import se.kits.gakusei.util.QuizHandler;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@RunWith(MockitoJUnitRunner.class)
public class QuizControllerTest {

    @InjectMocks
    private QuizController quizController;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private QuizHandler quizHandler;

    private String lessonName;
    private String quizName;
    private List<Quiz> fewQuizzes;
    private List<Quiz> manyQuizzes;
    private int pageSize;
    private String searchString;
    private Quiz quiz;
    private List<HashMap<String, Object>> questions;

    @Before
    public void setUp() throws Exception {
        lessonName = "testLesson";
        quizName = "Testquiz";
        fewQuizzes = TestTools.generateQuizzes(5, "Test", "Beskrivning");
        manyQuizzes = TestTools.generateQuizzes(30, "Test", "Beskrivning");
        pageSize = 10;
        searchString = "test";
        quiz = TestTools.generateQuiz();
        questions = new ArrayList<>();
        questions.add(TestTools.createQuestion(quiz, 3));
    }

    @Test
    public void testGetQuizQuestions() {
        Mockito.when(quizRepository.findByName(quiz.getName())).thenReturn(Collections.singletonList(quiz));
        List<HashMap<String, Object>> dtoList = Collections.singletonList(TestTools.generateQuestion());
        Mockito.when(quizHandler.getQuizNuggetsForGakusei(quiz.getId())).thenReturn(dtoList);
        ResponseEntity<List<HashMap<String, Object>>> re = quizController.getQuizQuestions(quizName);

        assertEquals(dtoList, re.getBody());
        assertEquals(HttpStatus.OK, re.getStatusCode());
    }

    @Test
    public void testGetQuizQuestionsLessonNameNull() {
        Mockito.when(lessonRepository.findByName(lessonName)).thenReturn(null);
        ResponseEntity<List<HashMap<String, Object>>> re = quizController.getQuizQuestions(lessonName);
        assertEquals(null, re.getBody());
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, re.getStatusCode());
    }

    @Test
    public void testGetAllQuizzesOK() {
        Mockito.when(quizRepository.findAll()).thenReturn(fewQuizzes);
        ResponseEntity<Iterable<Quiz>> re = quizController.getQuizzes();
        assertEquals(fewQuizzes, re.getBody());
        assertEquals(HttpStatus.OK, re.getStatusCode());
    }

    @Test
    public void testGetFirstPageOfQuizzesOK() {
        Pageable pageRequest = new PageRequest(0, pageSize);
        Page<Quiz> firstPage = TestTools.generateQuizzesPage(manyQuizzes, pageRequest);
        Mockito.when(quizRepository.findAll(pageRequest)).thenReturn(firstPage);
        ResponseEntity<Iterable<Quiz>> re = quizController.getQuizzesPage(0);
        assertEquals(firstPage.getContent(), re.getBody());
        assertEquals(HttpStatus.OK, re.getStatusCode());
    }

    @Test
    public void testGetLastPageOfQuizzesOK() {
        int lastPageIndex = manyQuizzes.size() / pageSize;
        Pageable pageRequest = new PageRequest(lastPageIndex, pageSize);
        Page<Quiz> lastPage = TestTools.generateQuizzesPage(manyQuizzes, pageRequest);
        Mockito.when(quizRepository.findAll(pageRequest)).thenReturn(lastPage);
        ResponseEntity<Iterable<Quiz>> re = quizController.getQuizzesPage(lastPageIndex);
        assertEquals(lastPage.getContent(), re.getBody());
        assertEquals(HttpStatus.OK, re.getStatusCode());
    }

    @Test
    public void testGetFirstPageOfQuizzesByNameOK() {
        Pageable pageRequest = new PageRequest(0, pageSize);
        Page<Quiz> firstMatchingPage = TestTools.generateQuizzesPage(manyQuizzes, pageRequest);
        Mockito.when(quizRepository.findByNameContainingIgnoreCase(searchString, pageRequest)).
                thenReturn(firstMatchingPage.getContent());
        ResponseEntity<Iterable<Quiz>> re = quizController.getQuizzesByName(searchString, 0);
        assertEquals(firstMatchingPage.getContent(), re.getBody());
        assertEquals(HttpStatus.OK, re.getStatusCode());
    }

    @Test
    public void testGetQuizNuggetsOK() {
        Mockito.when(quizHandler.getQuizNuggets(quiz.getId())).thenReturn(questions);
        ResponseEntity<List<HashMap<String,Object>>> re = quizController.getQuizNuggets(quiz.getId());
        assertEquals(questions, re.getBody());
        assertEquals(HttpStatus.OK, re.getStatusCode());
    }
}
