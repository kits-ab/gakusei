package se.kits.gakusei.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.LessonRepository;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class LessonController {
    private Logger logger = LoggerFactory.getLogger(LessonController.class);

    @Autowired
    private LessonRepository lessonRepository;

    @RequestMapping(
            value = "/api/lessons",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    ResponseEntity<List<Lesson>> getLessonNames(
            @RequestParam(value = "lessonType") String lessonType) {
        List<Lesson> tmpLessons = getLessons(lessonType);
        if (tmpLessons != null) {
            return new ResponseEntity<>(tmpLessons, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Cacheable("lessons")
    public List<Lesson> getLessons(String lessonType) {
        List<Lesson> tmpLessons = null;
        if (lessonType.equals("quiz")) {
            tmpLessons = lessonRepository.findQuizLessons().stream()
                    .filter(lesson -> lesson.getNuggets().size() >= 4).collect(Collectors.toList());
        } else if (lessonType.equals("vocabulary")){
            tmpLessons = lessonRepository.findVocabularyLessons().stream()
                    .filter(lesson -> lesson.getNuggets().size() >= 4).collect(Collectors.toList());
        }
        return tmpLessons;
    }

    @RequestMapping(
            value = "/api/lessonInfo",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<HashMap<String, HashMap<String, Integer>>> getQuestionInfo (
            @RequestParam(name = "questionType", defaultValue = "reading") String questionType,
            @RequestParam(name = "answerType", defaultValue = "swedish") String answerType,
            @RequestParam(name = "username") String username) {
        HashMap<String, HashMap<String, Integer>> values = getStringHashMapHashMap(questionType, answerType, username);
        return new ResponseEntity<>(values, HttpStatus.OK);
    }

    private HashMap<String, HashMap<String, Integer>> getStringHashMapHashMap(String questionType, String answerType, String username) {
        long mark = System.currentTimeMillis();

        HashMap<String, HashMap<String, Integer>> values = new HashMap<>();
        
        List<Lesson> tmpLessons = getLessons();

        logger.info("Getting vocabulary lessons took {} ms.", System.currentTimeMillis() - mark);
        mark = System.currentTimeMillis();
        for (Lesson tmpLesson : tmpLessons) {
            List<Nugget> correctlyAnsweredNuggets = lessonRepository.findCorrectlyAnsweredNuggets(username, tmpLesson.getName())
                    .stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
            List<Nugget> unansweredNuggets = lessonRepository.findUnansweredNuggets(username, tmpLesson.getName())
                    .stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
            List<Nugget> allLessonNuggets = getNuggets(questionType, answerType, tmpLesson);

            for (Nugget n :
                    correctlyAnsweredNuggets) {
                logger.debug("ca :" + n.getId());
            }
            for (Nugget n :
                    unansweredNuggets) {
                logger.debug("un:" + n.getId());
            }
            logger.info("Un count for {}: {}", tmpLesson.getName(), unansweredNuggets.size());
            HashMap<String, Integer> lessonData = new HashMap<>();
            lessonData.put("unanswered", unansweredNuggets.size());
            lessonData.put("correctlyAnswered", correctlyAnsweredNuggets.size());
            lessonData.put("all", allLessonNuggets.size());

            values.put(tmpLesson.getName(), lessonData);

        }

        logger.info("Collecting lesson nuggets took {} ms", System.currentTimeMillis() - mark);
        return values;
    }

    @Cacheable("twoFactTypeNuggets")
    public List<Nugget> getNuggets(String questionType, String answerType, Lesson tmpLesson) {
        return lessonRepository.findNuggetsByTwoFactTypes(tmpLesson.getName(),
                        questionType, answerType).stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
    }

    @Cacheable("lessons")
    public List<Lesson> getLessons() {
        return lessonRepository.findVocabularyLessons().stream()
                .filter(lesson -> lesson.getNuggets().size() >= 4).collect(Collectors.toList());
    }
}
