package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.http.ResponseEntity;
import se.kits.gakusei.content.model.Course;

public interface CourseRepository extends CrudRepository<Course, Long> {

    Course findByName(String name);
    Course findByCourseCode(String courseCode);

}
