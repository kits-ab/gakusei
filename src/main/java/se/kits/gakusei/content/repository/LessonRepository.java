package se.kits.gakusei.content.repository;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import se.kits.gakusei.content.model.Kanji;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;

public interface LessonRepository
        extends CrudRepository<Lesson, Long> {

    Lesson findByName(String name);

    List<Nugget> findNuggetsBySuccessrate(@Param("username") String username, @Param("lessonName") String lessonName);

    List<Nugget> findUnansweredNuggets(@Param("username") String username, @Param("lessonName") String lessonName);

    @Query(value = "SELECT COUNT(contentschema.nuggets.id) FROM contentschema.nuggets \n" +
            "LEFT JOIN contentschema.lessons_nuggets ON lessons_nuggets.nugget_id = nuggets.id \n" +
            "LEFT JOIN contentschema.lessons ON lessons_nuggets.lesson_id = lessons.id\n" +
            "WHERE contentschema.nuggets.hidden is false and lessons.name = :lessonName", nativeQuery = true)
    @Cacheable("lessons.numbers")
    Integer findNumberOfNuggetsByName(@Param("lessonName") String lessonName);

    @Query(value = "SELECT COUNT(contentschema.kanjis.id) FROM contentschema.kanjis \n" +
            "LEFT JOIN contentschema.lessons_kanjis ON lessons_kanjis.kanji_id = kanjis.id \n" +
            "LEFT JOIN contentschema.lessons ON lessons_kanjis.lesson_id = lessons.id\n" +
            "WHERE lessons.name = :lessonName", nativeQuery = true)
    @Cacheable("lessons.numbers")
    Integer findNumberOfKanjisByName(@Param("lessonName") String lessonName);

    List<Nugget> findCorrectlyAnsweredNuggets(@Param("username") String username, @Param("lessonName") String lessonName);

    List<Nugget> findNuggetsByRetentionDate(@Param("username") String username, @Param("lessonName") String lessonName);

    List<Nugget> findUnansweredRetentionNuggets(@Param("username") String username, @Param("lessonName") String lessonName);

    List<Nugget> findVerbNuggets(@Param("lessonId") Long lessonId);

    List<Lesson> findAllByOrderByName();

    @Query(value = "select COUNT(id) from contentschema.nuggets where id in " +
            "(select nugget_id from progresstrackinglist where user_ref = :username and correct_count > 0)" +
            "and id in " +
            "(select nugget_id from contentschema.lessons inner join contentschema.lessons_nuggets on " +
            "contentschema.lessons.id=contentschema.lessons_nuggets.lesson_id where name = :lessonName)",
            nativeQuery = true)
    Integer findNumberOfCorrectlyAnsweredNuggets(@Param("username") String username, @Param("lessonName") String lessonName);

    @Query(value = "SELECT COUNT(contentschema.nuggets.id) FROM contentschema.nuggets\n" +
            "WHERE nuggets.id IN (SELECT progresstrackinglist.nugget_id FROM progresstrackinglist \n" +
            "\tINNER JOIN contentschema.lessons_nuggets ON progresstrackinglist.nugget_id = lessons_nuggets.nugget_id\n" +
            "\tWHERE user_ref = :username AND progresstrackinglist.retention_date <= current_timestamp \n" +
            "\tAND lesson_id IN (SELECT id FROM contentschema.lessons WHERE name = :lessonName) ORDER BY retention_date ASC)",
            nativeQuery = true)
    Integer findNumberOfNuggetsByRetentionDate(@Param("username") String username, @Param("lessonName") String lessonName);

    @Query(value = "SELECT COUNT(contentschema.nuggets.id) FROM contentschema.nuggets\n" +
            "WHERE nuggets.hidden IS FALSE AND nuggets.id NOT IN\n" +
            "(SELECT lessons_nuggets.nugget_id FROM contentschema.lessons_nuggets\n" +
            "LEFT JOIN progresstrackinglist ON progresstrackinglist.nugget_id = lessons_nuggets.nugget_id\n" +
            "WHERE (user_ref = :username) AND retention_date IS NOT NULL\n" +
            "AND lesson_id IN (SELECT id FROM contentschema.lessons WHERE name = :lessonName))\n" +
            "AND nuggets.id IN (SELECT nugget_id FROM contentschema.lessons_nuggets RIGHT JOIN contentschema.lessons " +
            "ON lessons_nuggets.lesson_id = lessons.id WHERE name = :lessonName)",
            nativeQuery = true)
    Integer findNumberOfUnansweredRetentionNuggets(@Param("username") String username, @Param("lessonName") String lessonName);

    @Query(value = "SELECT COUNT(id) FROM contentschema.kanjis WHERE id IN\n" +
            "\t(SELECT nugget_id FROM progresstrackinglist WHERE user_ref = :username AND correct_count > 0)\n" +
            "\tAND id IN\n" +
            "\t(SELECT kanji_id FROM contentschema.lessons INNER JOIN contentschema.lessons_kanjis ON\n" +
            "\tcontentschema.lessons.id=contentschema.lessons_kanjis.lesson_id WHERE NAME = :lessonName)",
            nativeQuery = true)
    Integer findNumberOfCorrectlyAnsweredKanjis(@Param("username") String username, @Param("lessonName") String lessonName);

    @Query(value = "SELECT COUNT(contentschema.kanjis.id) FROM contentschema.kanjis\n" +
            "WHERE kanjis.id IN (SELECT progresstrackinglist.nugget_id FROM progresstrackinglist\n" +
            "INNER JOIN contentschema.lessons_kanjis ON progresstrackinglist.nugget_id = lessons_kanjis.kanji_id\n" +
            "WHERE user_ref = :username AND progresstrackinglist.retention_date <= current_timestamp\n" +
            "AND lesson_id IN (SELECT id FROM contentschema.lessons WHERE name = :lessonName) ORDER BY retention_date ASC)",
            nativeQuery = true)
    Integer findNumberOfKanjisByRetentionDate(@Param("username") String username, @Param("lessonName") String lessonName);

    @Query(value = "SELECT COUNT(contentschema.kanjis.id) FROM contentschema.kanjis\n" +
            "WHERE kanjis.id NOT IN\n" +
            "(SELECT lessons_kanjis.kanji_id FROM contentschema.lessons_kanjis\n" +
            "LEFT JOIN progresstrackinglist ON progresstrackinglist.nugget_id = lessons_kanjis.kanji_id\n" +
            "WHERE (user_ref = :username) AND retention_date IS NOT NULL\n" +
            "AND lesson_id IN (SELECT id FROM contentschema.lessons WHERE name = :lessonName))\n" +
            "AND kanjis.id IN (SELECT kanji_id FROM contentschema.lessons_kanjis RIGHT JOIN contentschema.lessons " +
            "ON lessons_kanjis.lesson_id = lessons.id WHERE name = :lessonName)",
            nativeQuery = true)
    Integer findNumberOfUnansweredRetentionKanjis(@Param("username") String username, @Param("lessonName") String lessonName);

    List<Kanji> findKanjisByRetentionDate(@Param("username") String username, @Param("lessonName") String lessonName);
    
    List<Kanji> findUnansweredRetentionKanjis(@Param("username") String username, @Param("lessonName") String lessonName);
}