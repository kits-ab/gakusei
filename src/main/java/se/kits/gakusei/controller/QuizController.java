package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Quiz;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.QuizRepository;
import se.kits.gakusei.util.QuestionHandler;
import se.kits.gakusei.util.QuizHandler;

import java.util.HashMap;
import java.util.List;

@RestController
public class QuizController {

    @Autowired
    LessonRepository lessonRepository;

    @Autowired
    QuestionHandler questionHandler;

    @Autowired
    QuizRepository quizRepository;

    @Autowired
    QuizHandler quizHandler;

    @RequestMapping(
            value = "/api/quiz",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<List<HashMap<String, Object>>> getQuizQuestions(@RequestParam(value = "lessonName") String lessonName) {
        Lesson lesson = lessonRepository.findByName(lessonName);
        if (lesson == null) return new ResponseEntity<List<HashMap<String, Object>>>(HttpStatus.INTERNAL_SERVER_ERROR);
        final List<HashMap<String, Object>> quizQuestions = questionHandler.createQuizQuestions(lesson.getNuggets());
        return new ResponseEntity<List<HashMap<String, Object>>>(quizQuestions, HttpStatus.OK);
    }

    @RequestMapping(
            value = "/api/quizes",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Iterable<Quiz>> getQuizes() {
        return new ResponseEntity<>(quizRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping(
        value = "/api/quiz/{quizId}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Quiz> getQuiz(@PathVariable(value="quizId") Long quizId) {
        return ResponseEntity.ok(quizRepository.findOne(quizId));
    }

    @RequestMapping(
            value = "/api/quizes/{offset}/{name}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<List<Quiz>> getQuizesByName(@PathVariable(value="name") String name,
                                                      @PathVariable(value="offset") int offset) {
        Pageable pageRequest;
        if (offset < 0)
            pageRequest = new PageRequest(0, 10);
        else
            pageRequest = new PageRequest(offset, 10);

        return new ResponseEntity<>(quizRepository.findByNameContainingIgnoreCase(name, pageRequest), HttpStatus.OK);
    }

    @RequestMapping(
            value = "/api/quizes/{offset}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<List<Quiz>> getQuizesPage(@PathVariable(value="offset") int
            offset) {
        Pageable pageRequest;
        if (offset < 0)
            pageRequest = new PageRequest(0, 10);
        else
            pageRequest = new PageRequest(offset, 10);

        return new ResponseEntity<>(quizRepository.findAll(pageRequest).getContent(), HttpStatus.OK);
    }

    @RequestMapping(
        value = "/api/quiz/nugget/{quizNuggetId}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public HashMap<String, Object> getQuizNugget(@PathVariable(value="quizNuggetId") Long quizNuggetId) {
        return quizHandler.getQuizNugget(quizNuggetId);
    }
}
