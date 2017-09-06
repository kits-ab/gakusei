package se.kits.gakusei.content.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import se.kits.gakusei.content.model.IncorrectAnswers;

import java.util.List;

public interface IncorrectAnswerRepository extends CrudRepository<IncorrectAnswers, Long> {

    List<IncorrectAnswers> getByQuizNugget_Id(Long id);

    @Query("SELECT COUNT(e)>0 from IncorrectAnswers e WHERE e.id = :id AND e.quizNugget.id = :quizNuggetId")
    boolean existsByIdAndQuizNuggetId(@Param("id") Long id, @Param("quizNuggetId") Long quizNuggetId);
}
