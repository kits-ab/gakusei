package se.kits.gakusei.controller;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.kits.gakusei.content.model.Kanji;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.test_tools.TestTools;
import se.kits.gakusei.util.KanjiHandler;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RunWith(MockitoJUnitRunner.class)
public class KanjiControllerTest {

    @InjectMocks
    private KanjiController kanjiController;

    @Mock
    private KanjiHandler kanjiHandler;

    @Mock
    private LessonRepository lessonRepository;

    @Value("${gakusei.questions-quantity}")
    private int quantity;

    private String lessonName;
    private String userName;
    private List<Kanji> kanjis;
    private List<Kanji> visibleKanjis;
    private Lesson lesson;
    private List<HashMap<String, Object>> questionList;

    @Before
    public void setUp() throws Exception {
        kanjiController = new KanjiController(lessonRepository, kanjiHandler);
        MockitoAnnotations.initMocks(this);
        lessonName = "Verbs";
        userName = "testUser";
        kanjis = TestTools.generateKanjis();
        visibleKanjis = kanjis.stream().filter(k -> !k.isHidden()).collect(Collectors.toList());
        lesson = new Lesson();
        lesson.setName(lessonName);
        lesson.setKanjis(kanjis);
        questionList = Collections.singletonList(TestTools.generateKanjiQuestion());
    }

    @Test
    public void testGetKanjiQuestionsFromLessonOK() throws Exception {
        Mockito.when(lessonRepository.findByName(lessonName)).thenReturn(lesson);
        Mockito.when(kanjiHandler.chooseKanjis(kanjis, quantity)).thenReturn(visibleKanjis);
        Mockito.when(kanjiHandler.createKanjiQuestions(visibleKanjis)).thenReturn(questionList);

        ResponseEntity<List<HashMap<String, Object>>> re = kanjiController.getKanjiQuestionsFromLesson(lessonName,
                userName, false);

        assertEquals(questionList, re.getBody());
        assertEquals(HttpStatus.OK, re.getStatusCode());
    }

    @Test
    public void testGetKanjiQuestionsFromLessonInternalServerError() throws Exception {
        questionList = Collections.EMPTY_LIST;

        Mockito.when(lessonRepository.findByName(lessonName)).thenReturn(lesson);
        Mockito.when(kanjiHandler.chooseKanjis(kanjis, quantity)).thenReturn(visibleKanjis);
        Mockito.when(kanjiHandler.createKanjiQuestions(visibleKanjis)).thenReturn(questionList);

        ResponseEntity<List<HashMap<String, Object>>> re = kanjiController.getKanjiQuestionsFromLesson(lessonName,
                userName, false);

        assertNull(re.getBody());
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, re.getStatusCode());
    }
}
