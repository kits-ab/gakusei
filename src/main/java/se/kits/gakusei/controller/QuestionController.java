package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.NuggetRepository;
import se.kits.gakusei.dto.QuestionDTO;
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
    protected ResponseEntity<QuestionDTO> getQuestion(
            @RequestParam(value = "wordType", defaultValue = "") String wordType,
            @RequestParam(name = "questionType", defaultValue = "reading") String questionType,
            @RequestParam(name = "answerType", defaultValue = "swedish") String answerType) {

        List<Nugget> nuggets = wordType.isEmpty() ?
                nuggetRepository.getNuggetsWithoutWordType(questionType, answerType) :
                nuggetRepository.getNuggetsWithWordType(wordType, questionType, answerType);

        QuestionDTO question = questionHandler.getQuestion(nuggets, questionType, answerType);

        return (question == null) ?
                new ResponseEntity<QuestionDTO>(HttpStatus.NO_CONTENT) :
                new ResponseEntity<QuestionDTO>(question, HttpStatus.OK);
    }

    @RequestMapping(
            value = "/api/questions",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    protected ResponseEntity<List<QuestionDTO>> getQuestionsFromLesson(
            @RequestParam(value = "lessonName") String lessonName,
            @RequestParam(name = "questionType", defaultValue = "reading") String questionType,
            @RequestParam(name = "answerType", defaultValue = "swedish") String answerType) {

        List<Nugget> nuggets = lessonRepository.findNuggetsByTwoFactTypes(lessonName, questionType, answerType);
        List<QuestionDTO> questions = questionHandler.getQuestions(nuggets, questionType, answerType);

        return questions.isEmpty() ?
                new ResponseEntity<List<QuestionDTO>>(HttpStatus.INTERNAL_SERVER_ERROR) :
                new ResponseEntity<List<QuestionDTO>>(questions, HttpStatus.OK);
    }
}
