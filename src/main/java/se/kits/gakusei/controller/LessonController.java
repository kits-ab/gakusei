package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.LessonRepository;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    @RequestMapping(
            value = "/api/lessons",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    protected ResponseEntity<List<Lesson>> getLessonNames(
            @RequestParam(value = "lessonType") String lessonType) {
        if (lessonType.equals("quiz")) {
            List<Lesson> tmpLessons = lessonRepository.findQuizLessons().stream()
                    .filter(lesson -> lesson.getNuggets().size() >= 4).collect(Collectors.toList());
            return new ResponseEntity<List<Lesson>>(tmpLessons, HttpStatus.OK);
        } else if (lessonType.equals("vocabulary")){
            List<Lesson> tmpLessons = lessonRepository.findVocabularyLessons().stream()
                    .filter(lesson -> lesson.getNuggets().size() >= 4).collect(Collectors.toList());
            return new ResponseEntity<List<Lesson>>(tmpLessons, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(
            value = "/api/lessonInfo",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    protected ResponseEntity<
            HashMap<String,
                    HashMap<String, Integer>
                    >> getQuestionInfo(
            @RequestParam(name = "questionType", defaultValue = "reading") String questionType,
            @RequestParam(name = "answerType", defaultValue = "swedish") String answerType,
            @RequestParam(name = "username") String username) {

        HashMap<String,
                HashMap<String, Integer>
                > values = new HashMap<>();

        List<Lesson> tmpLessons = lessonRepository.findVocabularyLessons().stream()
                .filter(lesson -> lesson.getNuggets().size() >= 4).collect(Collectors.toList());

        for (Lesson tmpLesson : tmpLessons) {
            List<Nugget> correctlyAnsweredNuggets = lessonRepository.findCorrectlyAnsweredNuggets(username, tmpLesson.getName(),
                    questionType, answerType).stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
            List<Nugget> unansweredNuggets = lessonRepository.findUnansweredNuggets(username, tmpLesson.getName(),
                    questionType, answerType).stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
            List<Nugget> allLessonNuggets = lessonRepository.findNuggetsByTwoFactTypes(tmpLesson.getName(),
                    questionType, answerType).stream().filter(n -> !n.isHidden()).collect(Collectors.toList());

            HashMap<String, Integer> lessonData = new HashMap<>();
            lessonData.put("unanswered", unansweredNuggets.size());
            lessonData.put("correctlyAnswered", correctlyAnsweredNuggets.size());
            lessonData.put("all", allLessonNuggets.size());

            values.put(tmpLesson.getName(), lessonData);

        }

        return new ResponseEntity<>(values, HttpStatus.OK);
    }
}
