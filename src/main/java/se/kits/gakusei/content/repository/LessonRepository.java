package se.kits.gakusei.content.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import se.kits.gakusei.content.model.Lesson;


public interface LessonRepository extends CrudRepository<Lesson, Long> {

    @Query("select l from Lesson l where l.name = :lessonName")
    Lesson findLessonByName(@Param("lessonName") String lessonName);
}
