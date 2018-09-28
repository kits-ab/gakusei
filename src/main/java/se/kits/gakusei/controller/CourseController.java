package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import se.kits.gakusei.content.model.Course;
import se.kits.gakusei.content.repository.CourseRepository;

@RestController
public class CourseController {
    @Autowired
    CourseRepository courseRepository;

    @RequestMapping(
        value = "api/courses",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Iterable<Course>> getAllCourses() {
        Iterable courses = courseRepository.findAll();

        if (courses != null) {
            return new ResponseEntity<Iterable<Course>>(courses, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(
        value = "api/courses/{courseID}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Course> getCourseByID(
        @PathVariable(value = "courseID")
        Long courseID
    ) {
        Course course = courseRepository.findById(courseID).orElse(null);

        return createResponseEntity(course);
    }

    @RequestMapping(
        value = "api/courses/{courseName}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Course> getCourseByName(
        @PathVariable(value = "courseName")
        String courseName
    ) {
        Course course = courseRepository.findByName(courseName);

        return createResponseEntity(course);
    }

    @RequestMapping(
        value = "api/courses/{courseCode}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Course> getCourseByCode(
        @PathVariable(value = "courseCode")
        String courseCode
    ) {
        Course course = courseRepository.findByCourseCode(courseCode);

        return createResponseEntity(course);
    }

    private ResponseEntity<Course> createResponseEntity(Course toReturn) {
        if (toReturn != null) {
            return new ResponseEntity<>(toReturn, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}

