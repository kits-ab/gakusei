package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.kits.gakusei.content.model.UserLesson;
import se.kits.gakusei.content.repository.UserLessonRepository;
import se.kits.gakusei.dto.DeadlineDTO;

import java.sql.Timestamp;
import java.util.List;

@RestController
public class UserLessonController {

    @Autowired
    private UserLessonRepository userLessonRepository;

    @RequestMapping(
            value = "api/userLessons",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<List<String>> getUserLesson(
            @RequestParam(value = "username") String username) {
        return new ResponseEntity<List<String>>(userLessonRepository.findUsersStarredLessons(username), HttpStatus.OK);
    }

    @RequestMapping(
            value = "api/userLessons/add",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<UserLesson> addUserLesson(
            @RequestParam(value = "lessonName") String lessonName,
            @RequestParam(value = "username") String username) {
        UserLesson UserLesson = new UserLesson(username, lessonName);
        userLessonRepository.save(UserLesson);
        return new ResponseEntity<UserLesson>(UserLesson, HttpStatus.OK);
    }

    @RequestMapping(
            value = "api/userLessons/remove",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<UserLesson> removeUserLesson(
            @RequestParam(value = "lessonName") String lessonName,
            @RequestParam(value = "username") String username) {
        List<UserLesson> userLesson = userLessonRepository.findDistinctUserLessonByUsernameAndLessonName(username, lessonName);
        userLessonRepository.delete(userLesson.get(0));
        return new ResponseEntity<UserLesson>(HttpStatus.OK);
    }

    @RequestMapping(
            value = "api/userLessons/setDeadline",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<UserLesson> setDeadlineToUserLesson(@RequestBody DeadlineDTO deadlineDTO) {
        List<UserLesson> userLessons = userLessonRepository.findDistinctUserLessonByUsernameAndLessonName(deadlineDTO.getUsername(), deadlineDTO.getLessonName());
        UserLesson userLesson = userLessons.get(0);
        userLesson.setDeadline(new Timestamp(deadlineDTO.getDeadline()));
        userLessonRepository.save(userLesson);
        return new ResponseEntity<UserLesson>(HttpStatus.OK);
    }
}
