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
        lessons = lessons.stream().filter(lesson -> lesson.getNuggets().size() >= 4 && lesson.getKanjis().isEmpty()).collect(Collectors.toList());
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

    //Cacheable wrappers for the database queries.
    @Cacheable("lessons.retention.correct")
    public Integer getNumberOfCorrectNuggets(String username, String lessonName) {
        return lessonRepository.findNumberOfCorrectlyAnsweredNuggets(username, lessonName);
    }

    @Cacheable("lessons.retention.unanswered")
    public Integer getNumberOfUnansweredRetentionNuggets(String username, String lessonName) {
        return lessonRepository.findNumberOfUnansweredRetentionNuggets(username, lessonName);
    }

    @Cacheable("lessons.retention.retention")
    public Integer getNumberOfRetentionNuggets(String username, String lessonName) {
        return lessonRepository.findNumberOfNuggetsByRetentionDate(username, lessonName);
    }

    @Cacheable("lessons.numbers")
    public Integer findNumberOfNuggetsByName(String lessonName) {
        return lessonRepository.findNumberOfNuggetsByName(lessonName);
    }

    // Kanji equivalents
    @Cacheable("lessons.kanji.numbers")
    public Integer findNumberOfKanjisByName(String lessonName) {
        return lessonRepository.findNumberOfKanjisByName(lessonName);
    }

    @Cacheable("lessons.kanji.retention.correct")
    public Integer getNumberOfCorrectKanjis(String username, String lessonName) {
        return lessonRepository.findNumberOfCorrectlyAnsweredKanjis(username, lessonName);
    }

    @Cacheable("lessons.kanji.retention.retention")
    public Integer getNumberOfRetentionKanjis(String username, String lessonName) {
        return lessonRepository.findNumberOfKanjisByRetentionDate(username, lessonName);
    }

    @Cacheable("lessons.kanji.retention.unanswered")
    public Integer getNumberOfUnansweredRetentionKanjis(String username, String lessonName) {
        return lessonRepository.findNumberOfUnansweredRetentionKanjis(username, lessonName);
    }



}
