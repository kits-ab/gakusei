package se.kits.gakusei.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import se.kits.gakusei.content.model.Kanji;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.util.KanjiHandler;

@RestController
public class KanjiController {
    @Value("${gakusei.questions-quantity}")
    private int quantity;

    private LessonRepository lessonRepository;
    private KanjiHandler kanjiHandler;

    @Autowired
    public KanjiController(
        LessonRepository lessonRepository,
        KanjiHandler kanjiHandler
    ) {
        this.lessonRepository = lessonRepository;
        this.kanjiHandler = kanjiHandler;
    }

    @RequestMapping(
        value = "/api/questions/kanji",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    ResponseEntity<List<HashMap<String, Object>>> getKanjiQuestionsFromLesson(
        @RequestParam(value = "lessonName")
        String lessonName,
        @RequestParam(name = "username")
        String username
    ) {
        List<
            HashMap<String, Object>
        > questions = getCachedKanjiQuestionsFromLesson(lessonName, username);
        return questions.isEmpty() ? new ResponseEntity<>(
            HttpStatus.INTERNAL_SERVER_ERROR
        ) : new ResponseEntity<>(questions, HttpStatus.OK);
    }

    private List<HashMap<String, Object>> getCachedKanjiQuestionsFromLesson(
        String lessonName,
        String username
    ) {
        List<Kanji> allLessonKanjis = cachedFindKanjis(lessonName);
        List<Kanji> chosenKanjis = kanjiHandler.chooseKanjis(
            allLessonKanjis,
            quantity
        );
        return kanjiHandler.createKanjiQuestions(chosenKanjis);
    }

    @Cacheable("kanjis")
    public List<Kanji> cachedFindKanjis(String lessonName) {
        return lessonRepository.findByName(lessonName).getKanjis();
    }

}

