package se.kits.gakusei.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
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
    private final Logger logger = LoggerFactory.getLogger(NuggetController.class);

    private final NuggetRepository nuggetRepository;

    private final FactRepository factRepository;

    @Autowired
    public NuggetController(NuggetRepository nuggetRepository, FactRepository factRepository) {
        this.nuggetRepository = nuggetRepository;
        this.factRepository = factRepository;
    }

    @RequestMapping(
            value = "/api/filter/nuggets",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<List<Nugget>> findNuggetsByFilter(
            @RequestParam(value = "wordType", defaultValue = "vocabulary") String wordType,
            @RequestParam(value = "factTypes") List<String> factTypes) {

        Long factFilterCount = factTypes.stream().filter(s -> !s.isEmpty()).count();

        // If no fact type filters are used, we should look for facts of all types
        if (factFilterCount == 0L) {
            factTypes = cachingGetAllFactTypes();
        }

        return new ResponseEntity<>(
                cachingGetNuggetsByFilter(wordType, factTypes, factFilterCount), HttpStatus.OK);
    }

    @Cacheable("factTypes")
    public List<String> cachingGetAllFactTypes() {
        long mark = System.currentTimeMillis();
        List<String> result = factRepository.getAllFactTypes();
        logger.info("Get all facts took {} ms", System.currentTimeMillis() - mark);
        return result;
    }

    @Cacheable("nuggetList")
    public List<Nugget> cachingGetNuggetsByFilter(String wordType, List<String> factTypes, Long factFilterCount) {
        long mark = System.currentTimeMillis();
        List<Nugget> result = nuggetRepository.getNuggetsbyFilter(wordType, factTypes, factFilterCount);
        logger.info("Get filtered facts took {} ms", System.currentTimeMillis() - mark);
        return result;
    }
}
