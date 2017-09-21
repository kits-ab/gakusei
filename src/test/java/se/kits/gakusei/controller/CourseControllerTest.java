package se.kits.gakusei.controller;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.kits.gakusei.content.model.Course;
import se.kits.gakusei.content.repository.CourseRepository;
import se.kits.gakusei.test_tools.TestTools;

import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class CourseControllerTest {

    @InjectMocks
    private CourseController courseController;

    @Mock
    private CourseRepository courseRepository;

    private Course testCourse;

    @Before
    public void setUp(){
        MockitoAnnotations.initMocks(this);

        testCourse = TestTools.generateCourse();
    }

    @Test
    public void testGetAllCoursesOK() throws Exception {
    }

    @Test
    public void testGetCourseByIDOK() throws Exception {
        Mockito.when(courseRepository.findOne(testCourse.getId())).thenReturn(testCourse);

        ResponseEntity<Course> re = courseController.getCourseByID(testCourse.getId());

        assertEquals(HttpStatus.OK, re.getStatusCode());
        assertEquals(testCourse, re.getBody());
    }

    @Test
    public void tetGetCourseByNameOK() throws Exception {
        Mockito.when(courseRepository.findByName(testCourse.getName())).thenReturn(testCourse);

        ResponseEntity<Course> re = courseController.getCourseByName(testCourse.getName());

        assertEquals(HttpStatus.OK, re.getStatusCode());
        assertEquals(testCourse, re.getBody());
    }

    @Test
    public void tetsGetCourseByCodeOK() throws Exception {
    }

}