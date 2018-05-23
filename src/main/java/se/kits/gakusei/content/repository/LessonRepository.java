package se.kits.gakusei.content.repository;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;

public interface LessonRepository
    extends CrudRepository<Lesson, Long> {

    Lesson findByName(String name);

    List<Nugget> findNuggetsBySuccessrate(
        @Param("username")
        String username,
        @Param("lessonName")
        String lessonName
    );

    List<Nugget> findUnansweredNuggets(
        @Param("username")
        String username,
        @Param("lessonName")
        String lessonName
    );

    @Cacheable("lessonNuggetsCorrect")
    List<Nugget> findCorrectlyAnsweredNuggets(
        @Param("username")
        String username,
        @Param("lessonName")
        String lessonName
    );
    @Cacheable("lessonNuggetsRetentionDate")
    List<Nugget> findNuggetsByRetentionDate(
        @Param("username")
        String username,
        @Param("lessonName")
        String lessonName
    );

    @Cacheable("lessonNuggetsRetentionUnanswered")
    List<Nugget> findUnansweredRetentionNuggets(
        @Param("username")
        String username,
        @Param("lessonName")
        String lessonName
    );

    List<Nugget> findVerbNuggets(
        @Param("lessonId")
        Long lessonId
    );

    List<Lesson> findAllByOrderByName();

}

