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

    @Query(value = "select COUNT(id) from contentschema.nuggets where id in " +
                    "(select nugget_id from progresstrackinglist where user_ref = :username and correct_count > 0)" +
                    "and id in " +
                    "(select nugget_id from contentschema.lessons inner join contentschema.lessons_nuggets on " +
                    "contentschema.lessons.id=contentschema.lessons_nuggets.lesson_id where name = :lessonName)",
    nativeQuery = true)
    Integer findNumberOfCorrectlyAnsweredNuggets(
            @Param("username")
                    String username,
            @Param("lessonName")
                    String lessonName
    );

    @Query(value = "SELECT COUNT(contentschema.nuggets.id) FROM contentschema.nuggets\n" +
            "WHERE nuggets.id IN (SELECT progresstrackinglist.nugget_id FROM progresstrackinglist \n" +
            "\tINNER JOIN contentschema.lessons_nuggets ON progresstrackinglist.nugget_id = lessons_nuggets.nugget_id\n" +
            "\tWHERE user_ref = :username AND progresstrackinglist.retention_date <= current_timestamp \n" +
            "\tAND lesson_id IN (SELECT id FROM contentschema.lessons WHERE name = :lessonName) ORDER BY retention_date ASC)",
            nativeQuery = true)
    Integer findNumberOfNuggetsByRetentionDate(
            @Param("username")
                    String username,
            @Param("lessonName")
                    String lessonName
    );

    @Query(value = "SELECT COUNT(contentschema.nuggets.id) FROM contentschema.nuggets\n" +
            "WHERE nuggets.id NOT IN\n" +
            "(SELECT lessons_nuggets.nugget_id FROM contentschema.lessons_nuggets\n" +
            "LEFT JOIN progresstrackinglist ON progresstrackinglist.nugget_id = lessons_nuggets.nugget_id\n" +
            "WHERE (user_ref = :username) AND retention_date IS NOT NULL\n" +
            "AND lesson_id IN (SELECT id FROM contentschema.lessons WHERE name = :lessonName))\n" +
            "AND nuggets.id IN (SELECT nugget_id FROM contentschema.lessons_nuggets RIGHT JOIN contentschema.lessons ON lessons_nuggets.lesson_id = lessons.id WHERE name = :lessonName)",
            nativeQuery = true)
    Integer findNumberOfUnansweredRetentionNuggets(
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

