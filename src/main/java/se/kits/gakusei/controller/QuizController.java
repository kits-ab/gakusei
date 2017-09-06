package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Quiz;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.QuizNuggetRepository;
import se.kits.gakusei.content.repository.QuizRepository;
import se.kits.gakusei.util.QuestionHandler;
import se.kits.gakusei.util.QuizHandler;

import javax.servlet.http.HttpServletRequest;
import javax.xml.ws.Response;
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

    @Autowired
    QuizNuggetRepository quizNuggetRepository;

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
    public ResponseEntity<Quiz> createQuiz(HttpServletRequest request, @RequestBody Quiz quiz) {
        if (!request.isUserInRole("ROLE_ADMIN"))
            return new ResponseEntity(null, HttpStatus.FORBIDDEN);
        return ResponseEntity.ok(quizRepository.save(quiz));
    }

    @RequestMapping(
        value = "/api/quiz/{quizId}/delete",
        method = RequestMethod.DELETE
    )
    public ResponseEntity deleteQuiz(HttpServletRequest request, @PathVariable(value="quizId") Long quizId) {
        if (!request.isUserInRole("ROLE_ADMIN"))
            return new ResponseEntity(null, HttpStatus.FORBIDDEN);
        quizRepository.delete(quizId);
        return new ResponseEntity(null, HttpStatus.OK);
    }

    @RequestMapping(
        value = "/api/quiz/update",
        method = RequestMethod.PUT
    )
    @ResponseStatus( value = HttpStatus.OK )
    public ResponseEntity<HashMap<String, Object>> updateQuiz(HttpServletRequest request, @RequestBody Quiz quiz) {
        if (!request.isUserInRole("ROLE_ADMIN"))
            return new ResponseEntity(null, HttpStatus.FORBIDDEN);
        if (quizRepository.exists(quiz.getId())) {
            quizRepository.save(quiz);
            return new ResponseEntity(null, HttpStatus.OK);
        }
        HashMap<String, Object> hashMap = new HashMap<>();
        hashMap.put("error", "Quiz does not exist");
        return new ResponseEntity(hashMap, HttpStatus.BAD_REQUEST);
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
    public ResponseEntity<HashMap<String, Object>> createQuizNugget(HttpServletRequest request,
                                                                    @RequestBody HashMap<String, Object> myQuizNugget) {
        if (!request.isUserInRole("ROLE_ADMIN"))
            return new ResponseEntity(null, HttpStatus.FORBIDDEN);
        HashMap<String, Object> newMyQuizNugget = null;
        try {
            newMyQuizNugget = quizHandler.createAndValidateQuizNugget(myQuizNugget);
        } catch (QuizHandler.QuizException exc) {
            newMyQuizNugget = new HashMap<>();
            newMyQuizNugget.put("error", exc.toString());
            return new ResponseEntity(newMyQuizNugget, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity(newMyQuizNugget, HttpStatus.OK);
    }

    @RequestMapping(
            value = "/api/quiz/nugget/update",
            method = RequestMethod.PUT,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<HashMap<String, Object>> updateQuizNugget(HttpServletRequest request,
                                                                    @RequestBody HashMap<String, Object> myQuizNugget) {
        if (!request.isUserInRole("ROLE_ADMIN"))
            return new ResponseEntity(null, HttpStatus.FORBIDDEN);

        HashMap<String, Object> newMyQuizNugget = null;
        try {
            quizHandler.updateAndValidateQuizNugget(myQuizNugget);
        } catch (QuizHandler.QuizException exc) {
            newMyQuizNugget = new HashMap<>();
            newMyQuizNugget.put("error", exc.toString());
            return new ResponseEntity(newMyQuizNugget, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity(newMyQuizNugget, HttpStatus.OK);
    }

    @RequestMapping(
            value = "/api/quiz/nugget/{quizNuggetId}/delete",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<HashMap<String, Object>> deleteQuizNugget(HttpServletRequest request,
                                                                    @PathVariable(value="quizNuggetId") Long quizNuggetId) {
        if (!request.isUserInRole("ROLE_ADMIN"))
            return new ResponseEntity(null, HttpStatus.FORBIDDEN);

        HashMap<String, Object> newMyQuizNugget = null;
        this.quizNuggetRepository.delete(quizNuggetId);
        return new ResponseEntity(null, HttpStatus.OK);
    }
}
