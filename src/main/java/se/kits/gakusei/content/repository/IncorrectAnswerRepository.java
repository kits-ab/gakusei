package se.kits.gakusei.content.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import se.kits.gakusei.content.model.IncorrectAnswer;

public interface IncorrectAnswerRepository
    extends CrudRepository<IncorrectAnswer, Long> {

    List<IncorrectAnswer> findByQuizNuggetId(Long id);

    @Transactional
    void deleteByQuizNuggetId(Long id);

    @Transactional
    void deleteByQuizNuggetIdIn(List<Long> ids);

}

