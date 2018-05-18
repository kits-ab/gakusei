package se.kits.gakusei.content.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import se.kits.gakusei.content.model.Inflection;
import se.kits.gakusei.content.model.Lesson;

public interface InflectionRepository
    extends CrudRepository<Inflection, Long> {

    List<Inflection> findByLessonId(Long id);

    Inflection findByLessonAndInflectionMethod(
        Lesson lesson,
        String inflectionMethod
    );

}

