package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.NuggetRepository;
import se.kits.gakusei.util.InputValidator;

import java.util.*;

@RestController
public class NuggetController {

    @Autowired
    private InputValidator inputValidator;

    @Autowired
    private NuggetRepository nuggetRepo;

    @RequestMapping(
            value = "/api/filter/nuggets",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    private ResponseEntity<List<Nugget>> findNuggetsByFilter(
            @RequestParam(value = "wordType", defaultValue = "") String wordType,
            @RequestParam(value = "factType1", defaultValue = "") String factType1,
            @RequestParam(value = "factType2", defaultValue = "") String factType2,
            @RequestParam(value = "factType3", defaultValue = "") String factType3,
            @RequestParam(value = "factType4", defaultValue = "") String factType4) {

        // First, some crude input validation on nugget word type
        String nuggetType = inputValidator.validateNuggetType(wordType);
        if (nuggetType.isEmpty()) {
            nuggetType = "%";
        }

        // Also perform validation on incoming fact types
        List<String> factTypes =
                inputValidator.validateFactTypes(Arrays.asList(factType1, factType2, factType3, factType4));

        Long factFilterCount = factTypes.stream().filter(s -> !s.isEmpty()).count();

        // If no fact type filters are used, we should look for facts of all types
        if (factFilterCount == 0L) {
            factTypes.clear();
            factTypes.addAll(inputValidator.getFactTypes());
        }

        return new ResponseEntity<List<Nugget>>(nuggetRepo.getNuggetsbyFilter(
                nuggetType, factTypes.get(0), factTypes.get(1), factTypes.get(2), factTypes.get(3), factFilterCount),
                HttpStatus.OK);

    }
}
