package se.kits.gakusei.content.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;

import java.util.List;

public interface LessonRepository extends CrudRepository<Lesson, Long> {

    @Query("select l from Lesson l where l.name = :lessonName")
    Lesson findLessonByName(@Param("lessonName") String lessonName);

    List<Nugget> findNuggetsByTwoFactTypes(
            @Param("lessonName") String lessonName,
            @Param("factType1") String questionType,
            @Param("factType2") String answerType);
}
