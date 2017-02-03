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
import se.kits.gakusei.dto.QuestionDTO;
import se.kits.gakusei.util.QuestionHandler;

import java.util.List;

@RestController
public class QuizController {

    @Autowired
    LessonRepository lessonRepository;

    @Autowired
    QuestionHandler questionHandler;

    @RequestMapping(
            value = "/api/quiz",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<List<QuestionDTO>> getQuizQuestions(@RequestParam(value = "lessonName") String lessonName) {
        Lesson lesson = lessonRepository.findByName(lessonName);
        if (lesson == null) return new ResponseEntity<List<QuestionDTO>>(HttpStatus.INTERNAL_SERVER_ERROR);
        final List<QuestionDTO> quizQuestions = questionHandler.createQuizQuestions(lesson.getNuggets());
        return new ResponseEntity<List<QuestionDTO>>(quizQuestions, HttpStatus.OK);
    }
}
