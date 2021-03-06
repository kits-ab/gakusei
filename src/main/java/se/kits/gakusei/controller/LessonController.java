package se.kits.gakusei.controller;

import java.util.*;
import java.util.stream.Collectors;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import se.kits.gakusei.content.model.FavoriteLesson;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.model.UserLesson;
import se.kits.gakusei.content.repository.InflectionRepository;
import se.kits.gakusei.content.repository.KanjiRepository;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.UserLessonRepository;
import se.kits.gakusei.util.LessonHandler;
import se.kits.gakusei.util.ProgressHandler;

@RestController
@Api(value="LessonController", description="Operations for handling lessons")
public class LessonController {
    private Logger logger = LoggerFactory.getLogger(LessonController.class);

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private InflectionRepository inflectionRepository;

    @Autowired
    private KanjiRepository kanjiRepository;

    @Autowired
    private UserLessonRepository userLessonRepository;

    @Autowired
    private LessonHandler lessonHandler;

    @Autowired
    private ProgressHandler progressHandler;

    @ApiOperation(value="Getting all the lessons", response = ResponseEntity.class)
    @RequestMapping(value = "/api/lessons", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<List<Lesson>> getLessons(@RequestParam(value = "lessonType") String lessonType) {

        if (lessonType.equals("grammar")) {
            return new ResponseEntity<>(lessonHandler.getGrammarLessons(), HttpStatus.OK);
        } else if (lessonType.equals("kanji")) {
            return new ResponseEntity<>(lessonHandler.getKanjiLessons(), HttpStatus.OK);
        }

        return new ResponseEntity<>(lessonHandler.getLessonsWithEnoughNuggets(), HttpStatus.OK);
    }

    @ApiOperation(value="Getting info about a question", response = ResponseEntity.class)
    @RequestMapping(value = "/api/lessonInfo", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<HashMap<String, HashMap<String, Integer>>> getQuestionInfo(
            @RequestParam(name = "lessonType", defaultValue = "guess") String lessonType,
            @RequestParam(name = "username") String username)
    {
        HashMap<String, HashMap<String, Integer>> values = getStringHashMapHashMap(username, lessonType);
        return new ResponseEntity<>(values, HttpStatus.OK);
    }

    @ApiOperation(value="Getting the wrong count", response = ResponseEntity.class)
    @RequestMapping(value = "/api/lessons/incorrectcount", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<HashMap<String, Integer>> getIncorrectCount(
            @RequestParam(name = "lessonType", defaultValue = "guess") String lessonType,
            @RequestParam(name = "username") String username)
    {

        return new ResponseEntity<>(progressHandler.getWrongCount(username), HttpStatus.OK);
    }

    @ApiOperation(value="Getting lessons marked as favorite", response = ResponseEntity.class)
    @RequestMapping(
            value = "/api/lessons/favorite",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<FavoriteLesson> getFavoriteLesson(
            @RequestParam(value = "lessonType", required = false) String lessonType,
            @RequestParam(value = "username") String username)
    {
        return new ResponseEntity<>(lessonHandler.getLessonFromFavorites(username, getFavoriteDataHashMap(username)),
                HttpStatus.OK);
    }


    public HashMap<String, HashMap<String, Integer>> getStringHashMapHashMap(String username, String lessonType){
        long mark = System.currentTimeMillis();

        HashMap<String, HashMap<String, Integer>> values = new HashMap<>();
        List<Lesson> tmpLessons;

        if(lessonType.equals("kanji")){
            tmpLessons = lessonHandler.getKanjiLessons();
        } else {
            tmpLessons = lessonHandler.getLessonsWithEnoughNuggets();
        }

        logger.info("Getting vocabulary lessons took {} ms.", System.currentTimeMillis() - mark);
        mark = System.currentTimeMillis();

        for (Lesson tmpLesson : tmpLessons) {

            Integer numNuggetsByName;
            Integer numCorrectlyAnswered;
            Integer numUnansweredRetention;
            Integer numRetentionNuggets;

            if(lessonType.equals("kanji")) {
                numNuggetsByName =  lessonHandler.findNumberOfKanjisByName(tmpLesson.getName());
                numCorrectlyAnswered = lessonHandler.getNumberOfCorrectKanjis(username, tmpLesson.getName());
                numUnansweredRetention = lessonHandler.getNumberOfUnansweredRetentionKanjis(username, tmpLesson.getName());
                numRetentionNuggets = lessonHandler.getNumberOfRetentionKanjis(username, tmpLesson.getName());

            } else {
                numNuggetsByName = lessonHandler.findNumberOfNuggetsByName(tmpLesson.getName());
                numCorrectlyAnswered = lessonHandler.getNumberOfCorrectNuggets(username, tmpLesson.getName());
                numUnansweredRetention = lessonHandler.getNumberOfUnansweredRetentionNuggets(username, tmpLesson.getName());
                numRetentionNuggets = lessonHandler.getNumberOfRetentionNuggets(username, tmpLesson.getName());
            }

            logger.info("Un count for {}: {}", tmpLesson.getName(), numUnansweredRetention);

            HashMap<String, Integer> lessonData = new HashMap<>();
            lessonData.put("all", numNuggetsByName);
            lessonData.put("unanswered", numUnansweredRetention);
            lessonData.put("correctlyAnswered", numCorrectlyAnswered);
            lessonData.put("retention", numRetentionNuggets);

            values.put(tmpLesson.getName(), lessonData);
        }
        logger.info("Collecting lesson nuggets took {} ms", System.currentTimeMillis() - mark);

        return values;
    }

    public HashMap<String, Integer> getFavoriteDataHashMap(String username) {
        List<Lesson> favoriteLessons = userLessonRepository.findUsersStarredLessons(username)
                .stream().map(UserLesson::getLesson).collect(Collectors.toList());
        HashMap<String, Integer> lessonData = new HashMap<>();

        List<Nugget> correctlyAnsweredNuggets = favoriteLessons.stream().map(
                lesson -> lessonRepository.findCorrectlyAnsweredNuggets(username, lesson.getName()))
                .flatMap(nuggets -> nuggets.stream()).filter(nugget -> !nugget.isHidden())
                .distinct().collect(Collectors.toList());

        List<Nugget> unansweredNuggets = favoriteLessons.stream().map(
                lesson -> lessonRepository.findUnansweredRetentionNuggets(username, lesson.getName()))
                .flatMap(nuggets -> nuggets.stream()).filter(nugget -> !nugget.isHidden())
                .distinct().collect(Collectors.toList());

        List<Nugget> allLessonNuggets = favoriteLessons.stream().map(
                lesson -> lesson.getNuggets()).flatMap(nuggets -> nuggets.stream())
                .filter(nugget -> !nugget.isHidden()).distinct().collect(Collectors.toList());

        List<Nugget> retentionNuggets = favoriteLessons.stream()
                .map(lesson -> lessonRepository.findNuggetsByRetentionDate(username, lesson.getName()))
                .flatMap(nuggets -> nuggets.stream()).filter(nugget -> !nugget.isHidden())
                .distinct().collect(Collectors.toList());

        lessonData.put("unanswered", unansweredNuggets.size());
        lessonData.put("correctlyAnswered", correctlyAnsweredNuggets.size());
        lessonData.put("all", allLessonNuggets.size());
        lessonData.put("retention", retentionNuggets.size());

        return lessonData;
    }




}

