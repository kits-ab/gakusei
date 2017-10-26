package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.IncorrectAnswers;

import java.util.List;

public interface IncorrectAnswerRepository extends CrudRepository<IncorrectAnswers, Long> {

    List<IncorrectAnswers> getByQuizNugget_Id(Long id);

}
