package se.kits.gakusei.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import se.kits.gakusei.content.model.FavoriteLesson;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.InflectionRepository;
import se.kits.gakusei.content.repository.KanjiRepository;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.UserLessonRepository;
import se.kits.gakusei.controller.LessonController;
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
        lessons = lessons.stream().filter(
                lesson -> lesson.getNuggets().size() >= 4 && lesson.getKanjis().isEmpty()
        ).collect(Collectors.toList());
        lessons.stream().forEach(lesson -> lesson.clearNuggets());
        return lessons;
    }

    public List<Lesson> getGrammarLessons() {
        return getLessonsWithEnoughNuggets().stream().filter(
                lesson -> !inflectionRepository.findByLessonId(
                        lesson.getId()
                ).isEmpty()
        ).collect(Collectors.toList());
    }

    @Cacheable("kanjilessons")
    public List<Lesson> getKanjiLessons() {
        List<Lesson> lessons = lessonRepository.findAllByOrderByName().stream().filter(
                lesson -> !lesson.getKanjis().isEmpty()).collect(Collectors.toList());
        lessons.stream().forEach(lesson -> lesson.clearKanjis());
        lessons.stream().forEach(lesson -> lesson.clearNuggets());
        return lessons;
    }

    public FavoriteLesson getLessonFromFavorites(String username, HashMap<String, Integer> hashMap) {
        FavoriteLesson favoriteLesson = new FavoriteLesson();
        favoriteLesson.setName("Favoriter");
        favoriteLesson.setId(1337L);
        favoriteLesson.setNuggetData(hashMap);

        return favoriteLesson;
    }


    //Cacheable wrappers for the database queries.
    @Cacheable(value = "lessons.retention.correct", key = "")
    public Integer getNumberOfCorrectNuggets(String username, String lessonName) {
        return lessonRepository.findNumberOfCorrectlyAnsweredNuggets(username, lessonName);
    }

    @Cacheable(value = "lessons.retention.unanswered", key = "")
    public Integer getNumberOfUnansweredRetentionNuggets(String username, String lessonName) {
        return lessonRepository.findNumberOfUnansweredRetentionNuggets(username, lessonName);
    }

    @Cacheable(value = "lessons.retention.retention", key = "")
    public Integer getNumberOfRetentionNuggets(String username, String lessonName) {
        return lessonRepository.findNumberOfNuggetsByRetentionDate(username, lessonName);
    }

    @Cacheable(value = "lessons.numbers", key = "")
    public Integer findNumberOfNuggetsByName(String lessonName) {
        return lessonRepository.findNumberOfNuggetsByName(lessonName);
    }

    // Kanji equivalents
    @Cacheable(value = "lessons.kanji.numbers", key = "")
    public Integer findNumberOfKanjisByName(String lessonName) {
        return lessonRepository.findNumberOfKanjisByName(lessonName);
    }

    @Cacheable(value = "lessons.kanji.retention.correct", key = "")
    public Integer getNumberOfCorrectKanjis(String username, String lessonName) {
        return lessonRepository.findNumberOfCorrectlyAnsweredKanjis(username, lessonName);
    }

    @Cacheable(value = "lessons.kanji.retention.retention", key = "")
    public Integer getNumberOfRetentionKanjis(String username, String lessonName) {
        return lessonRepository.findNumberOfKanjisByRetentionDate(username, lessonName);
    }

    @Cacheable(value = "lessons.kanji.retention.unanswered", key = "")
    public Integer getNumberOfUnansweredRetentionKanjis(String username, String lessonName) {
        return lessonRepository.findNumberOfUnansweredRetentionKanjis(username, lessonName);
    }

    @CacheEvict(value = {"lessons.retention.retention", "lessons.retention.unanswered",
    "lessons.retention.correct"}, key = "")
    public void evictCacheNuggets(String username, String lessonName){
        //Used to evict the cache
    }

    @CacheEvict(value = {"lessons.kanji.retention.retention", "lessons.kanji.retention.unanswered",
            "lessons.kanji.retention.correct"}, key = "")
    public void evictCacheKanjis(String username, String lessonName){
        //Used to evict the cache
    }
}
