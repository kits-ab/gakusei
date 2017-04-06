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

    private LessonRepository lessonRepository;

    private QuestionHandler questionHandler;

    @Value("${gakusei.questions-quantity}")
    private int quantity;

    @Autowired
    public QuestionController(LessonRepository lessonRepository, QuestionHandler questionHandler) {
        this.lessonRepository = lessonRepository;
        this.questionHandler = questionHandler;
    }

    @RequestMapping(
            value = "/api/questions",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    ResponseEntity<List<HashMap<String, Object>>> getQuestionsFromLesson(
            @RequestParam(value = "lessonName") String lessonName,
            @RequestParam(value = "lessonType", defaultValue = "vocabulary") String lessonType,
            @RequestParam(name = "questionType", defaultValue = "reading") String questionType,
            @RequestParam(name = "answerType", defaultValue = "swedish") String answerType,
            @RequestParam(name = "username") String username) {

        List<Nugget> nuggetsWithLowSuccessrate = lessonRepository.findNuggetsBySuccessrate(username, lessonName);
        List<Nugget> unansweredNuggets = lessonRepository.findUnansweredNuggets(username, lessonName);

        List<Nugget> allLessonNuggets;
        if (lessonType.equals("kanji")) {
            allLessonNuggets = lessonRepository.findKanjiNuggetsByFactType(lessonName, questionType,
                    answerType);

        } else {
            allLessonNuggets = lessonRepository.findKanjiLessNuggetsByFactType(lessonName, questionType,
                    answerType);
        }

        List<Nugget> nuggets = questionHandler.chooseNuggetsByProgress(nuggetsWithLowSuccessrate, unansweredNuggets,
                allLessonNuggets, quantity);

        List<HashMap<String, Object>> questions = questionHandler.createQuestions(nuggets, quantity, questionType,
                answerType);

        return questions.isEmpty() ?
                new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR) :
                new ResponseEntity<>(questions, HttpStatus.OK);
    }
}
