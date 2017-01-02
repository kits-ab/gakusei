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
    private NuggetRepository nuggetRepo;

    @Autowired
    private FactRepository factRepository;

    @RequestMapping(
            value = "/api/filter/nuggets",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    private ResponseEntity<List<Nugget>> findNuggetsByFilter(
            @RequestParam(value = "wordType", defaultValue = "") String wordType,
            @RequestParam(value = "factType1", defaultValue = "") String ft1,
            @RequestParam(value = "factType2", defaultValue = "") String ft2,
            @RequestParam(value = "factType3", defaultValue = "") String ft3,
            @RequestParam(value = "factType4", defaultValue = "") String ft4,
            @RequestParam(value = "factType5", defaultValue = "") String ft5,
            @RequestParam(value = "factType6", defaultValue = "") String ft6,
            @RequestParam(value = "factType7", defaultValue = "") String ft7,
            @RequestParam(value = "factType8", defaultValue = "") String ft8,
            @RequestParam(value = "factType9", defaultValue = "") String ft9,
            @RequestParam(value = "factType10", defaultValue = "") String ft10,
            @RequestParam(value = "factType11", defaultValue = "") String ft11,
            @RequestParam(value = "factType12", defaultValue = "") String ft12) {

        if (wordType.isEmpty()) {
            wordType = "%";
        }

        List<String> factTypes = Arrays.asList(ft1, ft2, ft3, ft4, ft5, ft6, ft7, ft8, ft9, ft10, ft11, ft12);

        Long factFilterCount = factTypes.stream().filter(s -> !s.isEmpty()).count();

        // If no fact type filters are used, we should look for facts of all types
        if (factFilterCount == 0L) {
            factTypes = factRepository.getAllFactTypes();
        }

        return new ResponseEntity<List<Nugget>>(nuggetRepo.getNuggetsbyFilter( wordType,
                factTypes.get(0), factTypes.get(1), factTypes.get(2), factTypes.get(3), factTypes.get(4),
                factTypes.get(5), factTypes.get(6), factTypes.get(7), factTypes.get(8), factTypes.get(9),
                factTypes.get(10), factTypes.get(11), factFilterCount),
                HttpStatus.OK);
    }
}
