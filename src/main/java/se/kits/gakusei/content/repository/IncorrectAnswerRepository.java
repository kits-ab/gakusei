package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;
import se.kits.gakusei.content.model.IncorrectAnswers;

import java.util.List;

public interface IncorrectAnswerRepository extends CrudRepository<IncorrectAnswers, Long> {

    List<IncorrectAnswers> findByQuizNuggetId(Long id);

    @Transactional
    void deleteByQuizNuggetId(Long id);

    @Transactional
    void deleteByQuizNuggetIdIn(List<Long> ids);

}
