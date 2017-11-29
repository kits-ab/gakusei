package se.kits.gakusei.content.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;

import java.util.List;

public interface LessonRepository extends CrudRepository<Lesson, Long> {

    Lesson findByName(String name);

    List<Nugget> findNuggetsByTwoFactTypes (
            @Param("lessonName") String lessonName,
            @Param("factType1") String questionType,
            @Param("factType2") String answerType);

    List<Nugget> findKanjiLessNuggetsByFactType (
            @Param("lessonName") String lessonName,
            @Param("factType1") String questionType,
            @Param("factType2") String answerType);

    List<Nugget> findKanjiNuggetsByFactType (
            @Param("lessonName") String lessonName,
            @Param("factType1") String questionType,
            @Param("factType2") String answerType);

    List<Nugget> findNuggetsBySuccessrate (
            @Param("username") String username,
            @Param("lessonName") String lessonName);

    List<Nugget> findUnansweredNuggets (
            @Param("username") String username,
            @Param("lessonName") String lessonName);

    List<Nugget> findCorrectlyAnsweredNuggets (
            @Param("username") String username,
            @Param("lessonName") String lessonName);

    List<Nugget> findVerbNuggets (@Param("lessonId") Long lessonId);

    List<Lesson> findAllByOrderByName();

}
