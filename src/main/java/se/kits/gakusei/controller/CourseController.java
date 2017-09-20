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
    public ResponseEntity<Iterable<Course>> getAllCourses(){
        return null;
    }

    @RequestMapping(
            value = "api/courses/{courseID}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Course> getCourseByID(@PathVariable(value = "courseID") Long courseID){
        return null;
    }

    @RequestMapping(
            value = "api/courses/{courseName}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Course> getCourseByName(@PathVariable(value = "courseName") String courseName){
        Course course = courseRepository.findByName(courseName);

        if(course != null){
            return new ResponseEntity<>(course, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(
            value = "api/courses/{courseCode}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Course> getCourseByCode(@PathVariable(value = "courseCode") String courseCode){
        Course course = courseRepository.findByCourseCode(courseCode);

        if(course != null){
            return new ResponseEntity<>(course, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
