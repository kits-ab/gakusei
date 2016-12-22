package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.NuggetRepository;
import se.kits.gakusei.dto.QuestionDTO;
import se.kits.gakusei.util.QuestionHandler;

import java.util.*;

@RestController
public class QuestionController {

    @Autowired
    private NuggetRepository nuggetRepository;

    @Autowired
    private QuestionHandler questionHandler;

    @RequestMapping(
            value = "/api/question",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    private ResponseEntity<QuestionDTO> getQuestion(
            @RequestParam(value = "wordType", defaultValue = "") String wordType,
            @RequestParam(name = "questionType", defaultValue = "reading") String questionType,
            @RequestParam(name = "answerType", defaultValue = "english_translation") String answerType) {

        List<Nugget> nuggets;
        if (wordType.equals("")) {
            nuggets = nuggetRepository.getNuggetsWithoutWordType(questionType, answerType);
        } else {
            nuggets = nuggetRepository.getNuggetsWithWordType(wordType, questionType, answerType);
        }

        QuestionDTO question = questionHandler.createQuestion(nuggets, questionType, answerType);

        if (question != null) {
            return new ResponseEntity<QuestionDTO>(question, HttpStatus.OK);
        } else {
            return new ResponseEntity<QuestionDTO>(HttpStatus.NO_CONTENT);
        }
    }
}