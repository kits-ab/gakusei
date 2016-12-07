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
import se.kits.gakusei.content.model.Question;
import se.kits.gakusei.content.repository.FactRepository;
import se.kits.gakusei.content.repository.NuggetRepository;

import java.util.ArrayList;
import java.util.List;

@RestController
public class QuestionController {
    @Autowired
    private FactRepository factRepo;

    @Autowired
    private NuggetRepository nuggetRepo;

    @RequestMapping(
            value = "/api/question",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    private ResponseEntity<Question> getQuestion(){
        Question question = new Question();
        Long id = 3L;
        Nugget nugget = nuggetRepo.findOne(id);
        if(nugget != null){
            question.setNugget(nugget);
            List<Fact> facts = nugget.getFacts();
            ArrayList<Fact> alternatives = new ArrayList<>();
            for(Fact f : facts){
                if(f.getType().equalsIgnoreCase("english_translation")){
                    alternatives.add(f);
                    break;
                }
            }
            alternatives.add(new Fact(
                "english_translation",
                    "older sister",
                    "informal",
                    new Nugget("noun")
            ));
            alternatives.add(new Fact(
                    "english_translation",
                    "younger sister",
                    "informal",
                    new Nugget("noun")
            ));
            alternatives.add(new Fact(
                    "english_translation",
                    "grandfather",
                    "grandfather",
                    new Nugget("noun")
            ));
//            alternatives.add(new Fact(
//                    "english_translation",
//                    "clever",
//                    "Clever",
//                    new Nugget("noun")
//            ));
            question.setAlternatives(alternatives);
            return new ResponseEntity<Question>(question, HttpStatus.OK);
        }

        return new ResponseEntity<Question>(question, HttpStatus.NOT_FOUND);
    }
}
