package se.kits.gakusei.content.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import se.kits.gakusei.content.model.Quiz;

import java.util.List;

public interface QuizRepository extends CrudRepository<Quiz, Long> {

    List<Quiz> findByName(String name);

    List<Quiz> findByNameContainingIgnoreCase(@Param("name") String name, Pageable pageRequest);

    Page<Quiz> findAll(Pageable pageRequest);
}
