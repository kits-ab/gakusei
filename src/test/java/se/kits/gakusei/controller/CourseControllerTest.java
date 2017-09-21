package se.kits.gakusei.controller;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.runners.MockitoJUnitRunner;
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
    public void getAllCourses() throws Exception {
    }

    @Test
    public void getCourseByID() throws Exception {
    }

    @Test
    public void getCourseByName() throws Exception {
    }

    @Test
    public void getCourseByCode() throws Exception {
    }

}