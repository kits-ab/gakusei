package se.kits.gakusei.controller;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.kits.gakusei.content.model.Course;
import se.kits.gakusei.content.repository.CourseRepository;
import se.kits.gakusei.test_tools.TestTools;

import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class CourseControllerTest {

    @InjectMocks
    private CourseController courseController;

    @Mock
    private CourseRepository courseRepository;

    private Course testCourse;
    private List testCourses;

    @Before
    public void setUp(){
        MockitoAnnotations.initMocks(this);

        testCourse = TestTools.generateCourse();
        testCourses = TestTools.generateCourses();
    }

    @Test
    public void testGetAllCoursesOK() throws Exception {
        Mockito.when(courseRepository.findAll()).thenReturn(testCourses);

        ResponseEntity<Iterable<Course>> re = courseController.getAllCourses();

        assertEquals(HttpStatus.OK, re.getStatusCode());
        assertEquals(testCourses, re.getBody());
    }

    @Test
    public void testGetAllCoursesServerError() {
        Mockito.when(courseRepository.findAll()).thenReturn(null);

        ResponseEntity<Iterable<Course>> re = courseController.getAllCourses();

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, re.getStatusCode());
    }

    @Test
    public void testGetCourseByIDOK() throws Exception {
        Mockito.when(courseRepository.findById(testCourse.getId())).thenReturn(Optional.of(testCourse));

        ResponseEntity<Course> re = courseController.getCourseByID(testCourse.getId());

        assertEquals(HttpStatus.OK, re.getStatusCode());
        assertEquals(testCourse, re.getBody());
    }

    @Test
    public void testGetCourseByIDNotFound() {
        Mockito.when(courseRepository.findById(testCourse.getId())).thenReturn(Optional.empty());

        ResponseEntity<Course> re = courseController.getCourseByID(testCourse.getId());

        assertEquals(HttpStatus.NOT_FOUND, re.getStatusCode());
    }

    @Test
    public void testGetCourseByNameOK() throws Exception {
        Mockito.when(courseRepository.findByName(testCourse.getName())).thenReturn(testCourse);

        ResponseEntity<Course> re = courseController.getCourseByName(testCourse.getName());

        assertEquals(HttpStatus.OK, re.getStatusCode());
        assertEquals(testCourse, re.getBody());
    }

    @Test
    public void testGetCourseByNameNotFound() {
        Mockito.when(courseRepository.findByName(testCourse.getName())).thenReturn(null);

        ResponseEntity<Course> re = courseController.getCourseByName(testCourse.getName());

        assertEquals(HttpStatus.NOT_FOUND, re.getStatusCode());
    }

    @Test
    public void testGetCourseByCodeOK() throws Exception {
        Mockito.when(courseRepository.findByCourseCode(testCourse.getCourseCode())).thenReturn(testCourse);

        ResponseEntity<Course> re = courseController.getCourseByCode(testCourse.getCourseCode());

        assertEquals(HttpStatus.OK, re.getStatusCode());
        assertEquals(testCourse, re.getBody());
    }

    @Test
    public void testGetCourseByCodeNotFound() {
        Mockito.when(courseRepository.findByCourseCode(testCourse.getCourseCode())).thenReturn(null);

        ResponseEntity<Course> re = courseController.getCourseByCode(testCourse.getCourseCode());

        assertEquals(HttpStatus.NOT_FOUND, re.getStatusCode());
    }

}