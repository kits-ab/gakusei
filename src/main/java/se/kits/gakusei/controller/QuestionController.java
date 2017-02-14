package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.util.QuestionHandler;

import java.util.*;

@RestController
public class QuestionController {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private QuestionHandler questionHandler;

    @Value("${gakusei.questions-quantity}")
    private int quantity;

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
        List<HashMap<String, Object>> questions = questionHandler.createQuestions(nuggets, quantity, questionType,
                answerType);

        return questions.isEmpty() ?
                new ResponseEntity<List<HashMap<String, Object>>>(HttpStatus.INTERNAL_SERVER_ERROR) :
                new ResponseEntity<List<HashMap<String, Object>>>(questions, HttpStatus.OK);
    }
}
