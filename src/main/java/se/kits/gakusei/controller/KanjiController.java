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
    @Value("${gakusei.kanji-quantity}")
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
        String username,
        @RequestParam(
                name = "spacedRepetition",
                required = false,
                defaultValue = "false"
        )
        boolean spacedRepetition
    ) {
        List<
            HashMap<String, Object>
        > questions = getCachedKanjiQuestionsFromLesson(lessonName, username, spacedRepetition);
        return questions.isEmpty() ? new ResponseEntity<>(
            HttpStatus.INTERNAL_SERVER_ERROR
        ) : new ResponseEntity<>(questions, HttpStatus.OK);
    }

    private List<HashMap<String, Object>> getCachedKanjiQuestionsFromLesson(
        String lessonName,
        String username,
        boolean spacedRepetition

    ) {
        List<Kanji> allLessonKanjis = cachedFindKanjis(lessonName);
        List<Kanji> chosenKanjis;



        if(!spacedRepetition){
            chosenKanjis = kanjiHandler.chooseKanjis(
                    allLessonKanjis,
                    quantity
            );
        } else {
            List<Kanji> unansweredKanjis = lessonRepository.findUnansweredRetentionKanjis(username, lessonName);
            List<Kanji> retentionKanjis = lessonRepository.findKanjisByRetentionDate(username, lessonName);

            chosenKanjis = kanjiHandler.chooseKanjis(unansweredKanjis, retentionKanjis, quantity);
        }



        return kanjiHandler.createKanjiQuestions(chosenKanjis);
    }

    public List<Kanji> cachedFindKanjis(String lessonName) {
        return lessonRepository.findByName(lessonName).getKanjis();
    }

}

