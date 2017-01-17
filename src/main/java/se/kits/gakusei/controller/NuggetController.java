package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.FactRepository;
import se.kits.gakusei.content.repository.NuggetRepository;

import java.util.*;

@RestController
public class NuggetController {

    @Autowired
    private NuggetRepository nuggetRepository;

    @Autowired
    private FactRepository factRepository;

    @RequestMapping(
            value = "/api/filter/nuggets",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    protected ResponseEntity<List<Nugget>> findNuggetsByFilter(
            @RequestParam(value = "wordType", defaultValue = "%") String wordType,
            @RequestParam(value = "factTypes") List<String> factTypes) {

        Long factFilterCount = factTypes.stream().filter(s -> !s.isEmpty()).count();

        // If no fact type filters are used, we should look for facts of all types
        if (factFilterCount == 0L) {
            factTypes = factRepository.getAllFactTypes();
        }

        return new ResponseEntity<List<Nugget>>( nuggetRepository.getNuggetsbyFilter(wordType,
                factTypes, factFilterCount), HttpStatus.OK);
    }
}
