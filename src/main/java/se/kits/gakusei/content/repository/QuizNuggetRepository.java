package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;
import se.kits.gakusei.content.model.QuizNugget;

import java.util.List;

public interface QuizNuggetRepository extends CrudRepository<QuizNugget, Long> {

    List<QuizNugget> findByQuizId(Long id);

    @Transactional
    void deleteByQuizId(Long id);
}
