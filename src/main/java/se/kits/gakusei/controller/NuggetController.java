package se.kits.gakusei.controller;

import java.util.*;
import java.util.stream.Collectors;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
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

@RestController
@Api(value="NuggetController", description="Operations for handeling nuggets")
public class NuggetController {
    private final Logger logger = LoggerFactory.getLogger(
        NuggetController.class
    );

    private final NuggetRepository nuggetRepository;
    private final WordTypeRepository wordTypeRepository;

    @Autowired
    public NuggetController(
        NuggetRepository nuggetRepository,
        WordTypeRepository wordTypeRepository
    ) {
        this.nuggetRepository = nuggetRepository;
        this.wordTypeRepository = wordTypeRepository;
    }

    @ApiOperation(value="Getting nuggets trough a filter", response = ResponseEntity.class)
    @RequestMapping(
        value = "/api/filter/nuggets",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<List<Nugget>> findNuggetsByFilter(
        @RequestParam(value = "wordType", defaultValue = "vocabulary")
        String wordType
    ) {
        if (wordType.equals("vocabulary")) {
            return new ResponseEntity<>(
                cachedNuggetsOfAllWordTypes(),
                HttpStatus.OK
            );
        }
        return new ResponseEntity<>(
            cachedNuggetsOfWordType(wordType),
            HttpStatus.OK
        );
    }

    public List<Nugget> cachedNuggetsOfAllWordTypes() {
        long mark = System.currentTimeMillis();
        List<Nugget> result = nuggetRepository.findAll().stream().filter(
            n -> !n.isHidden()
        ).collect(Collectors.toList());
        logger.info(
            "Get all nuggets took {} ms",
            System.currentTimeMillis() - mark
        );
        return result;
    }

    public List<Nugget> cachedNuggetsOfWordType(String type) {
        long mark = System.currentTimeMillis();
        List<Nugget> result = new ArrayList<>();
        WordType wordType = wordTypeRepository.findByType(type);
        if (wordType != null) {
            result = nuggetRepository.findByWordType(wordType).stream().filter(
                n -> !n.isHidden()
            ).collect(Collectors.toList());
        }
        logger.info(
            "Get filtered nuggets took {} ms",
            System.currentTimeMillis() - mark
        );
        return result;
    }

}

