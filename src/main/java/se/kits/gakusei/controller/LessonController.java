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
import se.kits.gakusei.content.model.UserLesson;
import se.kits.gakusei.content.repository.InflectionRepository;
import se.kits.gakusei.content.repository.KanjiRepository;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.UserLessonRepository;

import java.util.*;
import java.util.stream.Collectors;

@RestController
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

    @RequestMapping(
            value = "/api/lessons",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<List<Lesson>> getLessons(@RequestParam(value = "lessonType") String lessonType) {
        if (lessonType.equals("grammar")) {
            return new ResponseEntity<>(getGrammarLessons(), HttpStatus.OK);
        } else if (lessonType.equals("kanji")) {
            return new ResponseEntity<>(getKanjiLessons(), HttpStatus.OK);
        }
        return new ResponseEntity<>(getLessonsWithEnoughNuggets(), HttpStatus.OK);
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

    @RequestMapping(
            value = "/api/lessons/favorite",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Lesson> getFavoriteLesson(@RequestParam(value = "lessonType", required = false) String lessonType,
                                                    @RequestParam(value = "username") String username) {
        return new ResponseEntity<>(getLessonFromFavorites(username), HttpStatus.OK);
    }

    private HashMap<String, HashMap<String, Integer>> getStringHashMapHashMap(String questionType, String answerType, String username) {
        long mark = System.currentTimeMillis();

        HashMap<String, HashMap<String, Integer>> values = new HashMap<>();
        
        List<Lesson> tmpLessons = getLessonsWithEnoughNuggets();

        logger.info("Getting vocabulary lessons took {} ms.", System.currentTimeMillis() - mark);
        mark = System.currentTimeMillis();
        for (Lesson tmpLesson : tmpLessons) {
            List<Nugget> correctlyAnsweredNuggets = lessonRepository.findCorrectlyAnsweredNuggets(username, tmpLesson.getName())
                    .stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
            List<Nugget> unansweredNuggets = lessonRepository.findUnansweredNuggets(username, tmpLesson.getName())
                    .stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
            List<Nugget> allLessonNuggets = getNuggets(tmpLesson);

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

    @Cacheable("lessonInfoNuggets")
    public List<Nugget> getNuggets(Lesson tmpLesson) {
        return tmpLesson.getNuggets().stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
    }

    @Cacheable("lessons")
    public List<Lesson> getLessonsWithEnoughNuggets() {
        return lessonRepository.findAllByOrderByName().stream()
                .filter(lesson -> lesson.getNuggets().size() >= 4).collect(Collectors.toList());
    }

    @Cacheable("grammarLessons")
    public List<Lesson> getGrammarLessons() {
        return getLessonsWithEnoughNuggets().stream()
                .filter(lesson -> !inflectionRepository.findByLessonId(lesson.getId()).isEmpty())
                .collect(Collectors.toList());
    }

    @Cacheable("kanjiLessons")
    public List<Lesson> getKanjiLessons() {
        return lessonRepository.findAllByOrderByName().stream().filter(lesson -> !lesson.getKanjis().isEmpty())
                .collect(Collectors.toList());
    }

    @Cacheable("favoriteLesson")
    public Lesson getLessonFromFavorites(String username) {
        /*List<Nugget> favoriteNuggets = userLessonRepository.findUsersStarredLessons(username).stream()
                .map(UserLesson::getLesson)
                .map(Lesson::getNuggets)
                .flatMap(List::stream)
                .filter(n -> !n.isHidden())
                .distinct()
                .collect(Collectors.toList());
*/
        Lesson favoriteLesson = new Lesson();
//        favoriteLesson.setNuggets(favoriteNuggets);
        favoriteLesson.setName("Favoriter");
        favoriteLesson.setId(1337L);

        return favoriteLesson;

    }
}
