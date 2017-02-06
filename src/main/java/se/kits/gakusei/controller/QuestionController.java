package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.NuggetRepository;
import se.kits.gakusei.util.QuestionHandler;

import java.util.*;

@RestController
public class QuestionController {

    @Autowired
    private NuggetRepository nuggetRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private QuestionHandler questionHandler;

    @RequestMapping(
            value = "/api/question",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    protected ResponseEntity<HashMap<String, Object>> getQuestion(
            @RequestParam(value = "wordType", defaultValue = "") String wordType,
            @RequestParam(name = "questionType", defaultValue = "reading") String questionType,
            @RequestParam(name = "answerType", defaultValue = "swedish") String answerType) {

        List<Nugget> nuggets = wordType.isEmpty() ?
                nuggetRepository.getNuggetsWithoutWordType(questionType, answerType) :
                nuggetRepository.getNuggetsWithWordType(wordType, questionType, answerType);

        HashMap<String, Object> question = questionHandler.createOneQuestion(nuggets, questionType, answerType);

        return (question == null) ?
                new ResponseEntity<HashMap<String, Object>>(HttpStatus.NO_CONTENT) :
                new ResponseEntity<HashMap<String, Object>>(question, HttpStatus.OK);
    }

    @RequestMapping(
            value = "/api/questions",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    protected ResponseEntity<List<HashMap<String, Object>>> getQuestionsFromLesson(
            @RequestParam(value = "lessonName") String lessonName,
            @RequestParam(name = "questionType", defaultValue = "reading") String questionType,
            @RequestParam(name = "answerType", defaultValue = "swedish") String answerType) {

        List<Nugget> nuggets = lessonRepository.findNuggetsByTwoFactTypes(lessonName, questionType, answerType);
        List<HashMap<String, Object>> questions = questionHandler.createManyQuestions(nuggets, questionType, answerType);

        return questions.isEmpty() ?
                new ResponseEntity<List<HashMap<String, Object>>>(HttpStatus.INTERNAL_SERVER_ERROR) :
                new ResponseEntity<List<HashMap<String, Object>>>(questions, HttpStatus.OK);
    }
}
