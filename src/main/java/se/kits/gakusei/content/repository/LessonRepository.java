package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Lesson;

public interface LessonRepository extends CrudRepository<Lesson, Long> {
}
