package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.kits.gakusei.content.model.Internationalization;
import se.kits.gakusei.content.repository.InternationalizationRepository;

@RestController
public class InternationalizationController {

    @Autowired
    private InternationalizationRepository internationalizationRepository;

    @RequestMapping(value = "api/internationalization", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<Iterable<Internationalization>> getSentences(
            @RequestParam(value = "language", required = false) String language,
            @RequestParam(value = "abbreviation", required = false) String abbreviation){

        Iterable<Internationalization> sentences;

        if(language == null && abbreviation == null) {
            sentences = internationalizationRepository.findAll();
        }else if(abbreviation == null){
            sentences = internationalizationRepository.findAllByLanguage(language);
        }else if(language == null){
            sentences = internationalizationRepository.findAllByAbbreviation(abbreviation);
        }else{
            sentences = internationalizationRepository.findByAbbreviationAndLanguage(abbreviation, language);
        }

        if (sentences != null){
            return new ResponseEntity<>(sentences, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
