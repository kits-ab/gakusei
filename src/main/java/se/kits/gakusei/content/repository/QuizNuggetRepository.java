package se.kits.gakusei.content.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import se.kits.gakusei.content.model.QuizNugget;

public interface QuizNuggetRepository
    extends CrudRepository<QuizNugget, Long> {

    List<QuizNugget> findByQuizId(Long id);

    @Transactional
    void deleteByQuizId(Long id);

}

