package se.kits.gakusei.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import se.kits.gakusei.content.model.FavoriteLesson;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.InflectionRepository;
import se.kits.gakusei.content.repository.KanjiRepository;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.UserLessonRepository;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class LessonHandler {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private InflectionRepository inflectionRepository;

    @Autowired
    private KanjiRepository kanjiRepository;

    @Autowired
    private UserLessonRepository userLessonRepository;

    @Cacheable("lessonInfoNuggets")
    public List<Nugget> getNuggets(Lesson tmpLesson) {
        return tmpLesson.getNuggets().stream().filter(
                n -> !n.isHidden()
        ).collect(Collectors.toList());
    }

    @Cacheable("lessons")
    public List<Lesson> getLessonsWithEnoughNuggets() {
        return lessonRepository.findAllByOrderByName().stream().filter(
                lesson -> lesson.getNuggets().size() >= 4
        ).collect(Collectors.toList());
    }

    @Cacheable("grammarLessons")
    public List<Lesson> getGrammarLessons() {
        return getLessonsWithEnoughNuggets().stream().filter(
                lesson -> !inflectionRepository.findByLessonId(
                        lesson.getId()
                ).isEmpty()
        ).collect(Collectors.toList());
    }

    @Cacheable("kanjiLessons")
    public List<Lesson> getKanjiLessons() {
        return lessonRepository.findAllByOrderByName().stream().filter(
                lesson -> !lesson.getKanjis().isEmpty()
        ).collect(Collectors.toList());
    }

    @Cacheable("favoriteLesson")
    public FavoriteLesson getLessonFromFavorites(String username, HashMap<String, Integer> hashMap) {
        FavoriteLesson favoriteLesson = new FavoriteLesson();
        favoriteLesson.setName("Favoriter");
        favoriteLesson.setId(1337L);
        favoriteLesson.setNuggetData(hashMap);

        return favoriteLesson;
    }
}
