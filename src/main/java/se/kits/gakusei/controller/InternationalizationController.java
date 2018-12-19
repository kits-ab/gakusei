package se.kits.gakusei.controller;

import com.fasterxml.jackson.databind.util.JSONPObject;
import org.json.JSONObject;
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

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

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

    @RequestMapping(value = "api/internationalization/resources", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String getInternationalizationResources(){

        JSONObject resources = new JSONObject();

        List<String> availableLangs = new ArrayList<>();

        Iterable<Internationalization> resourceList = internationalizationRepository.findAll();

        resourceList.forEach(internationalization -> {
            if (!availableLangs.contains(internationalization.getLanguage())){
                availableLangs.add(internationalization.getLanguage());
            }
        });

        availableLangs.forEach(lang -> {
            JSONObject translations = new JSONObject();
            Iterable<Internationalization> tmpResources = internationalizationRepository.findAllByLanguage(lang);
            tmpResources.forEach(internationalization -> {
                translations.put(internationalization.getAbbreviation(), internationalization.getSentence());
            });
            JSONObject languageTranslation = new JSONObject();
            languageTranslation.put("Translations", translations);
            resources.put(lang, languageTranslation);
        });

        return resources.toString();
    }

    @RequestMapping(value = "api/internationalization/populateDB", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public void populateTableInternationalization(){
        File file = new File("src/main/js/shared/i18n.js");
        try{
            boolean print = false;
            String lang = "";
            String nextLine;
            FileReader fr = new FileReader(file);
            BufferedReader br = new BufferedReader(fr);

            while(br.ready()){
                nextLine = br.readLine();
                if(nextLine.split(":")[0].trim().equalsIgnoreCase("se")
                        || nextLine.split(":")[0].trim().equalsIgnoreCase("en")
                        || nextLine.split(":")[0].trim().equalsIgnoreCase("jp")){
                    lang = nextLine.split(":")[0].trim();
                    print = true;
                }
                if (print && !nextLine.contains("translations: {") && !nextLine.contains("se: {")
                        && !nextLine.contains("en: {") && !nextLine.contains("jp: {")
                        && !nextLine.trim().equalsIgnoreCase("}")
                        && nextLine.trim().length() > 1){
                    Internationalization i18n = new Internationalization();
                    i18n.setLanguage(lang);
                    i18n.setAbbrievation(nextLine.split(":")[0].trim());
                    i18n.setSentence(nextLine.split(":")[1]);
                    internationalizationRepository.save(i18n);
                }
                if(nextLine.contains("}")){
                    print = false;
                }
            }

        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
