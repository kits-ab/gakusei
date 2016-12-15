package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import se.kits.gakusei.content.model.Answer;
import se.kits.gakusei.content.model.Fact;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.model.Question;
import se.kits.gakusei.content.repository.FactRepository;
import se.kits.gakusei.content.repository.NuggetRepository;

import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@RestController
public class QuestionController {
    @Autowired
    private FactRepository factRepo;

    @RequestMapping(
            value = "/api/question",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    private ResponseEntity<Question> getQuestion() {
        Question question = new Question();
        Random random = new Random();

        List<Fact> allFacts = (List) factRepo.findAll();
        List<Fact> engFacts = allFacts.stream().filter(f -> f.getType()
                .equalsIgnoreCase("english_translation"))
                .collect(Collectors.toList());

        //Only get a question which has an english_translation alternative
        List<Fact> tempQuestion;
        Fact correctAlternative;
        do {
            correctAlternative = engFacts.get(random.nextInt(engFacts.size()));
            Nugget nugget = correctAlternative.getNugget();
            tempQuestion = allFacts.stream().filter(f -> f.getType()
                    .equalsIgnoreCase("kanji") && f.getNugget().equals(nugget))
                    .collect(Collectors.toList());
        } while (tempQuestion.isEmpty());

        //Avoid duplicate alternatives
        List<Fact> alternatives = new ArrayList<>();
        alternatives.add(correctAlternative);
        while (alternatives.size() < 5) {
             Fact tempFact = engFacts.get(random.nextInt(engFacts.size()));
             if (!alternatives.contains(tempFact)) {
                 alternatives.add(tempFact);
             }
        }

        question.setQuestion(tempQuestion.get(0).getData());
        question.setCorrectAlternative(alternatives.get(0).getData());
        question.setAlternative1(alternatives.get(1).getData());
        question.setAlternative2(alternatives.get(2).getData());
        question.setAlternative3(alternatives.get(3).getData());

        return new ResponseEntity<Question>(question, HttpStatus.OK);
    }

    @RequestMapping(
            value = "/api/answer",
            method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    private ResponseEntity<Question> answer(@RequestBody Answer answer){
        // receive answer
        // check answer
        // send new question

        System.out.println("Student answered: " + answer.getAnswer());


        return getQuestion();
    }
}