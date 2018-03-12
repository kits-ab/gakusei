package se.kits.gakusei.util;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import se.kits.gakusei.content.model.Kanji;
import se.kits.gakusei.test_tools.TestTools;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RunWith(MockitoJUnitRunner.class)
public class KanjiHandlerTest {

    private List<Kanji> kanjis;
    private KanjiHandler kanjiHandler;
    private List<Kanji> visibleKanjis;

    @Before
    public void setUp() throws Exception {
        kanjis = TestTools.generateKanjis();
        kanjiHandler = new KanjiHandler();
        visibleKanjis = kanjis.stream().filter(n -> !n.isHidden()).collect(Collectors.toList());

    }

    @Test
    public void testCreateKanjiQuestions() throws Exception {
        List<HashMap<String, Object>> questions = kanjiHandler.createKanjiQuestions(kanjis);
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("question")).get(0).startsWith("swe_test")));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("question")).get(1).startsWith("sign_test")));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("alternative1")).isEmpty()));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("alternative2")).isEmpty()));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("alternative3")).isEmpty()));
        assertTrue(questions.stream().allMatch(q -> ((List<String>) q.get("correctAlternative")).get(0).startsWith
                ("sign_test")));
    }

    @Test
    public void testCreateKanjiQuestion() throws Exception {
        Kanji kanji = visibleKanjis.get(0);
        HashMap<String, Object> dto = KanjiHandler.createKanjiQuestion(kanji);

        assertTrue(((List<String>) dto.get("question")).get(0).startsWith("swe_test"));
        assertTrue(((List<String>) dto.get("correctAlternative")).get(0).startsWith("sign_test"));
        Stream.of(dto.get("alternative1"),
                dto.get("alternative2"),
                dto.get("alternative3"))
                .forEach(alt -> assertTrue(((List<String>) alt).isEmpty()));

        String q = ((List<String>) dto.get("question")).get(1);
        String ca = ((List<String>) dto.get("correctAlternative")).get(0);
        assertEquals(q.charAt(q.length()-1), ca.charAt(ca.length()-1));

    }


    @Test
    public void testChooseNuggets() {
        int quantity = 5;
        List<Kanji> chosen = kanjiHandler.chooseKanjis(visibleKanjis, quantity);
        assertTrue(visibleKanjis.size() >= quantity ? chosen.size() == quantity : chosen.size() == visibleKanjis.size());
    }
}
