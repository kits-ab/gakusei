package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Quiz;

public interface QuizRepository extends CrudRepository<Quiz, Long> {

    Quiz findByName(String name);
}