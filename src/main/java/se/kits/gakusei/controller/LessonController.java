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
import se.kits.gakusei.content.repository.LessonRepository;

import java.util.List;
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
}
