package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
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
        value = "/api/quiz/{quizId}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Quiz> getQuiz(@PathVariable(value="quizId") Long quizId) {
        return ResponseEntity.ok(quizRepository.findOne(quizId));
    }

    @RequestMapping(
        value = "/api/quiz/create",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {
        // TODO: add isAdmin
        return ResponseEntity.ok(quizRepository.save(quiz));
    }

    @RequestMapping(
        value = "/api/quiz/{quizId}/delete",
        method = RequestMethod.DELETE
    )
    @ResponseStatus( value = HttpStatus.OK )
    public void deleteQuiz(@PathVariable(value="quizId") Long quizId) {
        // TODO: add isAdmin
        quizRepository.delete(quizId);
        return;
    }

    @RequestMapping(
        value = "/api/quiz/update",
        method = RequestMethod.PUT
    )
    @ResponseStatus( value = HttpStatus.OK )
    public void updateQuiz(@RequestBody Quiz quiz) {
        // TODO: add isAdmin
        if (quizRepository.exists(quiz.getId()))
            quizRepository.save(quiz);
        return;
    }

    @RequestMapping(
        value = "/api/quiz/nugget/{quizNuggetId}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public HashMap<String, Object> getQuizNugget(@PathVariable(value="quizNuggetId") Long quizNuggetId) {
        return quizHandler.getQuizNugget(quizNuggetId);
    }

    @RequestMapping(
            value = "/api/quiz/nugget/create",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public HashMap<String, Object> createQuizNugget(@RequestBody HashMap<String, Object> myQuizNugget) {
        // TODO: add isAdmin
        HashMap<String, Object> newMyQuizNugget = null;
        try {
            newMyQuizNugget = quizHandler.createAndValidateQuizNugget(myQuizNugget);
        } catch (Exception exc) {
            newMyQuizNugget = new HashMap<>();
            newMyQuizNugget.put("error", exc.toString());
            // TODO: change http status
        }
        return newMyQuizNugget;
    }
}
