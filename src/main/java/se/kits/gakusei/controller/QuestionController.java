package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import se.kits.gakusei.content.model.Fact;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.dto.QuestionDTO;
import se.kits.gakusei.content.repository.FactRepository;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class QuestionController {
    @Autowired
    private FactRepository factRepo;

    @RequestMapping(
            value = "/api/question",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    private ResponseEntity<QuestionDTO> getQuestion() {
        QuestionDTO question = new QuestionDTO();
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

        return new ResponseEntity<QuestionDTO>(question, HttpStatus.OK);
    }
}