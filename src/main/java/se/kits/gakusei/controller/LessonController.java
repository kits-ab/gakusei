package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.kits.gakusei.content.repository.LessonRepository;

import java.util.List;

@RestController
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    @RequestMapping(
            value = "/api/lessonNames",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    protected ResponseEntity<List<String>> getLessonNames(
            @RequestParam(value = "lessonType") String lessonType) {
        if (lessonType.equals("quiz")) {
            return new ResponseEntity<List<String>>(lessonRepository.findQuizLessonNames(), HttpStatus.OK);
        } else if (lessonType.equals("vocabulary")){
            return new ResponseEntity<List<String>>(lessonRepository.findVocabularyLessonNames(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}