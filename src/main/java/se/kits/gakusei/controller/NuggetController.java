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
import se.kits.gakusei.content.model.WordType;
import se.kits.gakusei.content.repository.NuggetRepository;
import se.kits.gakusei.content.repository.WordTypeRepository;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class NuggetController {
    private final Logger logger = LoggerFactory.getLogger(NuggetController.class);

    private final NuggetRepository nuggetRepository;
    private final WordTypeRepository wordTypeRepository;

    @Autowired
    public NuggetController(NuggetRepository nuggetRepository, WordTypeRepository wordTypeRepository) {
        this.nuggetRepository = nuggetRepository;
        this.wordTypeRepository = wordTypeRepository;
    }

    @RequestMapping(
            value = "/api/filter/nuggets",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<List<Nugget>> findNuggetsByFilter(
            @RequestParam(value = "wordType", defaultValue = "vocabulary") String wordType) {

        if (wordType.equals("vocabulary")) {
            return new ResponseEntity<>(cachedNuggetsOfAllWordTypes(), HttpStatus.OK);
        }

        return new ResponseEntity<>(cachedNuggetsOfWordType(wordType), HttpStatus.OK);
    }

    @Cacheable("allWordTypeNuggets")
    public List<Nugget> cachedNuggetsOfAllWordTypes() {
        long mark = System.currentTimeMillis();
        List<Nugget> result = nuggetRepository.findAll().stream().filter(n -> !n.isHidden())
                .collect(Collectors.toList());
        logger.info("Get all facts took {} ms", System.currentTimeMillis() - mark);
        return result;
    }

    @Cacheable("oneWordTypeNugget")
    public List<Nugget> cachedNuggetsOfWordType(String type) {
        long mark = System.currentTimeMillis();
        List<Nugget> result = new ArrayList<>();;
        WordType wordType = wordTypeRepository.findByType(type);
        if (wordType != null) {
            result = nuggetRepository.findByWordType(wordType).stream().filter(n -> !n.isHidden())
                    .collect(Collectors.toList());
        }
        logger.info("Get filtered facts took {} ms", System.currentTimeMillis() - mark);
        return result;
    }
}
