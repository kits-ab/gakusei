package se.kits.gakusei.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
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
import se.kits.gakusei.util.ProgressHandler;

@RestController
@Api(value="KanjiController", description="Operations for handling kanjis")
public class KanjiController {
    @Value("${gakusei.kanji-quantity}")
    private int quantity;

    private LessonRepository lessonRepository;
    private KanjiHandler kanjiHandler;
    private ProgressHandler progressHandler;

    @Autowired
    public KanjiController(
        LessonRepository lessonRepository,
        KanjiHandler kanjiHandler,
        ProgressHandler progressHandler
    ) {
        this.lessonRepository = lessonRepository;
        this.kanjiHandler = kanjiHandler;
        this.progressHandler = progressHandler;
    }

    @ApiOperation(value="Getting kanji questions from a lesson", response = ResponseEntity.class)
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

    @ApiOperation(value="Getting kanji questions that a user has answered incorrectly", response = ResponseEntity.class)
    @RequestMapping(
            value = "/api/wrongquestions/kanji",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    ResponseEntity<List<HashMap<String, Object>>> createWrongAnswersQuestions(
            @RequestParam(value = "userName") String userName){
        List<HashMap<String, Object>> questions;

        questions = getCachedKanjiFromWrongAnswers(userName);

        //returnerar en lista av nuggets en användare har svarat fel på
        return questions.isEmpty() ? new ResponseEntity<>(
                HttpStatus.NO_CONTENT
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
    private List<HashMap<String, Object>> getCachedKanjiFromWrongAnswers(
            String username

    ) {
        List<Kanji> allLessonKanjis = progressHandler.getWrongKanji(username);
        List<Kanji> chosenKanjis;

            chosenKanjis = kanjiHandler.chooseKanjis(allLessonKanjis, quantity);

        return kanjiHandler.createKanjiQuestions(chosenKanjis);
    }

    public List<Kanji> cachedFindKanjis(String lessonName) {
        return lessonRepository.findByName(lessonName).getKanjis();
    }

}

