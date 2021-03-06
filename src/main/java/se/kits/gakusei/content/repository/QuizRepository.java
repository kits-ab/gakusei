package se.kits.gakusei.content.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import se.kits.gakusei.content.model.Quiz;

public interface QuizRepository
    extends CrudRepository<Quiz, Long> {

    Quiz findByName(String name);

    List<Quiz> findByNameContainingIgnoreCase(
        @Param("name")
        String name,
        Pageable pageRequest
    );

    Page<Quiz> findAll(Pageable pageRequest);

}

