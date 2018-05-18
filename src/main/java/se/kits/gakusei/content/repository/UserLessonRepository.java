package se.kits.gakusei.content.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import se.kits.gakusei.content.model.UserLesson;

public interface UserLessonRepository
    extends CrudRepository<UserLesson, Long> {

    @Query("select ul from UserLesson ul where ul.user.username = :username")
    List<UserLesson> findUsersStarredLessons(
        @Param("username")
        String username
    );

    @Query(
        "select distinct ul from UserLesson ul where ul.user.username = :username and ul.lesson.name = :lessonName"
    )
    List<UserLesson> findUserLessonByUsernameAndLessonName(
        @Param("username")
        String username,
        @Param("lessonName")
        String lessonName
    );

}

