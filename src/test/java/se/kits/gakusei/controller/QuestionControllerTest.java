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
import se.kits.gakusei.content.model.Fact;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.NuggetRepository;
import se.kits.gakusei.dto.QuestionDTO;
import se.kits.gakusei.util.QuestionHandler;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@RunWith(MockitoJUnitRunner.class)
public class QuestionControllerTest {

    @InjectMocks
    QuestionController questionController;

    @Mock
    NuggetRepository nuggetRepository;

    @Mock
    QuestionHandler questionHandler;

    @Mock
    LessonRepository lessonRepository;

    String wordType;
    String questionType;
    String answerType;
    String question;
    String alt1;
    String alt2;
    String alt3;
    String altCorrect;
    List<Nugget> nuggets;
    QuestionDTO dto;

    @Before
    public void setUp() throws Exception {
        questionController = new QuestionController();
        MockitoAnnotations.initMocks(this);

        questionType = "reading";
        answerType = "swedish";
        question = "question";
        alt1 = "alternative1";
        alt2 = "alternative2";
        alt3 = "alternative3";
        altCorrect = "alternativeCorrect";
        nuggets = generateNuggets();
        dto = new QuestionDTO();
        dto.setQuestion(question);
        dto.setAlternative1(alt1);
        dto.setAlternative2(alt2);
        dto.setAlternative3(alt3);
        dto.setCorrectAlternative(altCorrect);
        Mockito.when(questionHandler.getQuestion(nuggets, questionType, answerType)).thenReturn(dto);
    }

    @Test
    public void testGetQuestionWithoutWordType() throws Exception {
        wordType = "";
        // Behaviour
        Mockito.when(nuggetRepository.getNuggetsWithoutWordType(questionType, answerType)).thenReturn(nuggets);

        ResponseEntity<QuestionDTO> re = questionController.getQuestion(wordType, questionType, answerType);
        assertEquals(dto, re.getBody());
        assertEquals(200, re.getStatusCodeValue());
    }

    @Test
    public void testGetQuestionWithWordType() throws Exception {
        wordType = "verb";
        Mockito.when(nuggetRepository.getNuggetsWithWordType(wordType, questionType, answerType)).thenReturn(nuggets);
        ResponseEntity<QuestionDTO> re = questionController.getQuestion(wordType, questionType, answerType);
        assertEquals(dto, re.getBody());
        assertEquals(200, re.getStatusCodeValue());
    }

    @Test
    public void testGetQuestionReturnNoContent() throws Exception {
        wordType = "";
        Mockito.when(nuggetRepository.getNuggetsWithoutWordType(questionType, answerType)).thenReturn(nuggets);
        Mockito.when(questionHandler.getQuestion(nuggets, questionType, answerType)).thenReturn(null);
        ResponseEntity<QuestionDTO> re = questionController.getQuestion(wordType, questionType, answerType);
        assertNull(re.getBody());
        assertEquals(204, re.getStatusCodeValue());
    }

    @Test
    public void testGetQuestionsFromLessonOK() throws Exception {
        String lesson = "Verbs";
        List<QuestionDTO> dtoList = Collections.singletonList(dto);
        Mockito.when(lessonRepository.findNuggetsByTwoFactTypes(lesson, questionType, answerType)).thenReturn(nuggets);
        Mockito.when(questionHandler.getQuestions(nuggets, questionType, answerType)).thenReturn(dtoList);

        ResponseEntity<List<QuestionDTO>> re = questionController.getQuestionsFromLesson(lesson, questionType, answerType);
        assertEquals(dtoList, re.getBody());
        assertEquals(200, re.getStatusCodeValue());
    }

    @Test
    public void testGetQuestionsFromLessonInternalServerError() throws Exception {
        String lesson = "Verbs";
        List<QuestionDTO> emptyList = Collections.EMPTY_LIST;
        Mockito.when(lessonRepository.findNuggetsByTwoFactTypes(lesson, questionType, answerType)).thenReturn(nuggets);
        Mockito.when(questionHandler.getQuestions(nuggets, questionType, answerType)).thenReturn(emptyList);

        ResponseEntity<List<QuestionDTO>> re = questionController.getQuestionsFromLesson(lesson, questionType, answerType);
        assertNull(re.getBody());
        assertEquals(500, re.getStatusCodeValue());
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
