package se.kits.gakusei.controller;

import java.util.HashMap;
import java.util.List;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
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

@RestController
@Api(value="QuizController", description="Operations for handeling quiz")
public class QuizController {
    @Autowired
    LessonRepository lessonRepository;

    @Autowired
    QuestionHandler questionHandler;

    @Autowired
    QuizRepository quizRepository;

    @Autowired
    QuizHandler quizHandler;

    @ApiOperation(value="Getting questions for one quiz", response = ResponseEntity.class)
    @RequestMapping(
        value = "/api/quiz",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<List<HashMap<String, Object>>> getQuizQuestions(
        @RequestParam(value = "lessonName")
        String lessonName
    ) {
        Quiz quiz = quizRepository.findByName(lessonName);

        if (quiz == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        final List<
            HashMap<String, Object>
        > correctFormat = quizHandler.getQuizNuggets(quiz.getId());
        return new ResponseEntity<>(correctFormat, HttpStatus.OK);
    }

    @ApiOperation(value="Getting all the quizzes", response = ResponseEntity.class)
    @RequestMapping(
        value = "/api/quizes",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Iterable<Quiz>> getQuizzes() {
        return new ResponseEntity<>(quizRepository.findAll(), HttpStatus.OK);
    }

    @ApiOperation(value="Get one quiz with a specific id", response = ResponseEntity.class)
    @RequestMapping(
        value = "/api/quiz/{quizId}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Quiz> getQuiz(
        @PathVariable(value = "quizId")
        Long quizId
    ) {
        return ResponseEntity.ok(quizRepository.findById(quizId).get());
    }

    @ApiOperation(value="Get quizzes by a specific name", response = ResponseEntity.class)
    @RequestMapping(
        value = "/api/quizes/{offset}/{name}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Iterable<Quiz>> getQuizzesByName(
        @PathVariable(value = "name")
        String name,
        @PathVariable(value = "offset")
        int offset
    ) {
        Pageable pageRequest;
        if (offset < 0){
        pageRequest = PageRequest.of(0, 10); }
        else{
        pageRequest = PageRequest.of(offset, 10);}

        return new ResponseEntity<>(
            quizRepository.findByNameContainingIgnoreCase(name, pageRequest),
            HttpStatus.OK
        );
    }

    @ApiOperation(value="Getting the specific page for quizes", response = ResponseEntity.class)
    @RequestMapping(
        value = "/api/quizes/{offset}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Iterable<Quiz>> getQuizzesPage(
        @PathVariable(value = "offset")
        int offset
    ) {
        Pageable pageRequest;
        if (offset < 0)
        pageRequest = PageRequest.of(0, 10); else
        pageRequest = PageRequest.of(offset, 10);
        return new ResponseEntity<>(
            quizRepository.findAll(pageRequest).getContent(),
            HttpStatus.OK
        );
    }

    @ApiOperation(value="Get nugget for quiz", response = ResponseEntity.class)
    @RequestMapping(
        value = "/api/quiz/nugget/{quizNuggetId}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public HashMap<String, Object> getQuizNugget(
        @PathVariable(value = "quizNuggetId")
        Long quizNuggetId
    ) {
        return quizHandler.getQuizNugget(quizNuggetId);
    }

}

