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
        List<Quiz> quizList = quizRepository.findByName(lessonName);

        if(quizList.size() != 1){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        Quiz quiz = quizList.get(0);

        if (quiz == null) {
            return new ResponseEntity<> (HttpStatus.NOT_FOUND);
        }

        final List<HashMap<String, Object>> correctFormat = quizHandler.getQuizNuggetsForGakusei(quiz.getId());

        return new ResponseEntity<>(correctFormat, HttpStatus.OK);
    }

    @RequestMapping(
            value = "/api/quizes",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Iterable<Quiz>> getQuizzes() {
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
    public ResponseEntity<Iterable<Quiz>> getQuizzesByName(@PathVariable(value="name") String name,
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
    public ResponseEntity<Iterable<Quiz>> getQuizzesPage(@PathVariable(value="offset") int
            offset) {
        Pageable pageRequest;
        if (offset < 0)
            pageRequest = new PageRequest(0, 10);
        else
            pageRequest = new PageRequest(offset, 10);

        return new ResponseEntity<>(quizRepository.findAll(pageRequest).getContent(), HttpStatus.OK);
    }

    @RequestMapping(
            value = "/api/quizes/{quizId}/nuggets",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<List<HashMap<String, Object>>> getQuizNuggets(@PathVariable(value="quizId") Long quizId) {
        List<HashMap<String, Object>> quizNuggets = quizHandler.getQuizNuggets(quizId);
        return new ResponseEntity<>(quizNuggets, HttpStatus.OK);
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
