package se.kits.gakusei.content.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import se.kits.gakusei.content.model.UserLesson;

import java.util.List;

public interface UserLessonRepository extends CrudRepository<UserLesson, Long> {

    @Query("select ul.lessonName from UserLesson ul where ul.username = :username")
    List<String> findUsersStarredLessons(@Param("username") String username);

    List<UserLesson> findDistinctUserLessonByUsernameAndLessonName(String username, String lessonName);
}
