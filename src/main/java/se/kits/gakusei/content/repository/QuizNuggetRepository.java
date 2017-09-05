package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.QuizNugget;

import java.util.List;

public interface QuizNuggetRepository extends CrudRepository<QuizNugget, Long> {

    List<QuizNugget> findByQuiz_Id(Long id);
}
