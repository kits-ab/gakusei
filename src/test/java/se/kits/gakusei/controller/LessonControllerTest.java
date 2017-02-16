package se.kits.gakusei.controller;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.ResponseEntity;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.UserRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RunWith(MockitoJUnitRunner.class)
public class LessonControllerTest {

    @InjectMocks
    private LessonController lessonController;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private UserRepository userRepository;

    private String username;
    private String lessonName;
    private User user;
    private Lesson lesson;

    @Before
    public void setUp() throws Exception {
        lessonController = new LessonController();
        MockitoAnnotations.initMocks(this);

        username = "testUser";
        lessonName = "testLesson";
        user = new User(username, "testPassword", "ROLE_USER");
        lesson = new Lesson();
        lesson.setName(lessonName);
        lesson.setUsers(new ArrayList<>());
    }

    @Test
    public void getUsersLessonsTest() {
        Mockito.when(lessonRepository.findLessonNamesByUsername(username)).thenReturn(Arrays.asList(lessonName));

        ResponseEntity<List<String>> re = lessonController.getUsersLessons(username);

        assertEquals(lessonName, re.getBody().get(0));
        assertEquals(200, re.getStatusCodeValue());
    }

    @Test
    public void addUserLessonTest() {
        Mockito.when(lessonRepository.findByName(lessonName)).thenReturn(lesson);
        Mockito.when(userRepository.findByUsername(username)).thenReturn(user);

        ResponseEntity<Lesson> re = lessonController.addUserLesson(lessonName, username);

        assertEquals(user, re.getBody().getUsers().get(0));
        assertEquals(200, re.getStatusCodeValue());
    }

    @Test
    public void removeUserLessonTest() {
        Mockito.when(lessonRepository.findByName(lessonName)).thenReturn(lesson);
        Mockito.when(userRepository.findByUsername(username)).thenReturn(user);
        user.setLessons(new ArrayList<>(Arrays.asList(lesson)));

        ResponseEntity<Lesson> re = lessonController.removeUserLesson(lessonName, username);

        assertTrue(re.getBody().getUsers().isEmpty());
        assertEquals(200, re.getStatusCodeValue());
    }
}
