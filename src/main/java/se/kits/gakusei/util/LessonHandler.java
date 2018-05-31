package se.kits.gakusei.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import se.kits.gakusei.content.model.FavoriteLesson;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.model.UserLesson;
import se.kits.gakusei.content.repository.InflectionRepository;
import se.kits.gakusei.content.repository.KanjiRepository;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.UserLessonRepository;
import se.kits.gakusei.controller.LessonController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class LessonHandler {
    private Logger logger = LoggerFactory.getLogger(LessonController.class);

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private InflectionRepository inflectionRepository;

    @Autowired
    private KanjiRepository kanjiRepository;

    @Autowired
    private UserLessonRepository userLessonRepository;

    public List<Nugget> getNuggets(Lesson tmpLesson) {
        return tmpLesson.getNuggets().stream().filter(
                n -> !n.isHidden()
        ).collect(Collectors.toList());
    }

    @Cacheable("lessons")
    public List<Lesson> getLessonsWithEnoughNuggets() {
        List<Lesson> lessons = lessonRepository.findAllByOrderByName();
        lessons.stream().filter(
                lesson -> lesson.getNuggets().size() >= 4
        ).forEach(lesson -> lesson.clearNuggets());
        return lessons;
    }

    public List<Lesson> getGrammarLessons() {
        return getLessonsWithEnoughNuggets().stream().filter(
                lesson -> !inflectionRepository.findByLessonId(
                        lesson.getId()
                ).isEmpty()
        ).collect(Collectors.toList());
    }

    public List<Lesson> getKanjiLessons() {
        return lessonRepository.findAllByOrderByName().stream().filter(
                lesson -> !lesson.getKanjis().isEmpty()
        ).collect(Collectors.toList());
    }

    public FavoriteLesson getLessonFromFavorites(String username, HashMap<String, Integer> hashMap) {
        FavoriteLesson favoriteLesson = new FavoriteLesson();
        favoriteLesson.setName("Favoriter");
        favoriteLesson.setId(1337L);
        favoriteLesson.setNuggetData(hashMap);

        return favoriteLesson;
    }

    public HashMap<String, HashMap<String, Integer>> getStringHashMapHashMap(
            String username
    ) {
        long mark = System.currentTimeMillis();

        HashMap<String, HashMap<String, Integer>> values = new HashMap<>();
        List<Lesson> tmpLessons = getLessonsWithEnoughNuggets();
        logger.info(
                "Getting vocabulary lessons took {} ms.",
                System.currentTimeMillis() - mark
        );
        mark = System.currentTimeMillis();
        for (Lesson tmpLesson : tmpLessons) {
            Integer numCorrectlyAnswered = lessonRepository.findNumberOfCorrectlyAnsweredNuggets(username, tmpLesson.getName());
            Integer numUnansweredRetention = lessonRepository.findNumberOfUnansweredRetentionNuggets(username, tmpLesson.getName());
            Integer numRetentionNuggets = lessonRepository.findNumberOfNuggetsByRetentionDate(username, tmpLesson.getName());

            logger.info(
                    "Un count for {}: {}",
                    tmpLesson.getName(),
                    numUnansweredRetention
            );
            HashMap<String, Integer> lessonData = new HashMap<>();
            lessonData.put("all", lessonRepository.findNumberOfNuggetsByName(tmpLesson.getName()));
            lessonData.put("unanswered", numUnansweredRetention);
            lessonData.put(
                    "correctlyAnswered",
                    numCorrectlyAnswered
            );
            lessonData.put("retention", numRetentionNuggets);

            values.put(tmpLesson.getName(), lessonData);
//            logger.info(
//                    "Correct: {} Lesson: {}",
//                    lessonRepository.findNumberOfCorrectlyAnsweredNuggets(username, tmpLesson.getName()),
//                    tmpLesson.getName());
        }
        logger.info(
                "Collecting lesson nuggets took {} ms",
                System.currentTimeMillis() - mark
        );
        return values;
    }

    public HashMap<String, Integer> getFavoriteDataHashMap(String username) {
        List<
                Lesson
                > favoriteLessons = userLessonRepository.findUsersStarredLessons(
                username
        ).stream().map(UserLesson::getLesson).collect(Collectors.toList());
        HashMap<String, Integer> lessonData = new HashMap<>();
        List<Nugget> correctlyAnsweredNuggets = favoriteLessons.stream().map(
                lesson -> lessonRepository.findCorrectlyAnsweredNuggets(
                        username,
                        lesson.getName()
                )
        ).flatMap(nuggets -> nuggets.stream()).filter(
                nugget -> !nugget.isHidden()
        ).distinct().collect(Collectors.toList());
        List<Nugget> unansweredNuggets = favoriteLessons.stream().map(
                lesson -> lessonRepository.findUnansweredRetentionNuggets(
                        username,
                        lesson.getName()
                )
        ).flatMap(nuggets -> nuggets.stream()).filter(
                nugget -> !nugget.isHidden()
        ).distinct().collect(Collectors.toList());
        List<Nugget> allLessonNuggets = favoriteLessons.stream().map(
                lesson -> lesson.getNuggets()
        ).flatMap(nuggets -> nuggets.stream()).filter(
                nugget -> !nugget.isHidden()
        ).distinct().collect(Collectors.toList());
        List<Nugget> retentionNuggets = favoriteLessons.stream().map(
                lesson -> lessonRepository.findNuggetsByRetentionDate(
                        username,
                        lesson.getName()
                )
        ).flatMap(nuggets -> nuggets.stream()).filter(
                nugget -> !nugget.isHidden()
        ).distinct().collect(Collectors.toList());
        lessonData.put("unanswered", unansweredNuggets.size());
        lessonData.put("correctlyAnswered", correctlyAnsweredNuggets.size());
        lessonData.put("all", allLessonNuggets.size());
        lessonData.put("retention", retentionNuggets.size());

        return lessonData;
    }
}
