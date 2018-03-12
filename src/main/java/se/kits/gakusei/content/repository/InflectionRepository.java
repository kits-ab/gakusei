package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Inflection;
import se.kits.gakusei.content.model.Lesson;

import java.util.List;

public interface InflectionRepository extends CrudRepository<Inflection, Long> {

    List<Inflection> findByLessonId(Long id);

    Inflection findByLessonAndInflectionMethod(Lesson lesson, String inflectionMethod);

}
