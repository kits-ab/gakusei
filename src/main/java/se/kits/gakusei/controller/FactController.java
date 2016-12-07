package se.kits.gakusei.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.kits.gakusei.content.model.Fact;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.FactRepository;
import se.kits.gakusei.content.repository.NuggetRepository;

import java.util.List;

@RestController
public class FactController {

    @Autowired
    private FactRepository factRepo;

    @Autowired
    private NuggetRepository nuggetRepo;

    @RequestMapping(
            value = "/api/nuggets/{id}/facts",
            method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    private ResponseEntity<Fact> createFact (@PathVariable("id") Long nuggetId, @RequestBody Fact postedFact) {
        Nugget nugget = nuggetRepo.findOne(nuggetId);
        if (nugget == null) {
            return new ResponseEntity<Fact>(postedFact, HttpStatus.NOT_FOUND);
        }
        postedFact.setNugget(nugget);
        Fact savedFact = factRepo.save(postedFact);
        nuggetRepo.save(nugget);
        return new ResponseEntity<Fact>(savedFact, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/api/nuggets/{id}/facts", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<List<Fact>> getNuggetsFacts(@PathVariable("id") Long nuggetId) {
        Nugget nugget = nuggetRepo.findOne(nuggetId);
        if (nugget == null) {
            return new ResponseEntity<List<Fact>>(HttpStatus.NOT_FOUND);
        }
        List<Fact> facts = nugget.getFacts();
        return new ResponseEntity<List<Fact>>(facts, HttpStatus.OK);
    }
}
