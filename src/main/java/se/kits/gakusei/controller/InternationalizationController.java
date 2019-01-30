package se.kits.gakusei.controller;

import io.swagger.annotations.Api;
import org.json.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.kits.gakusei.content.model.Internationalization;
import se.kits.gakusei.content.model.Settings;
import se.kits.gakusei.content.repository.InternationalizationRepository;
import se.kits.gakusei.content.repository.SettingsRepository;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@Api(value="InternationalizationController", description="Operations for handling internationalization")
public class InternationalizationController {

    @Autowired
    private InternationalizationRepository internationalizationRepository;

    @Autowired
    private SettingsRepository settingsRepository;

    @RequestMapping(value = "api/internationalization", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<Iterable<Internationalization>> getSentences(
            @RequestParam(value = "language", required = false) String language,
            @RequestParam(value = "abbreviation", required = false) String abbreviation) {

        Iterable<Internationalization> sentences;

        if (language == null && abbreviation == null) {
            sentences = internationalizationRepository.findAll();
        } else if (abbreviation == null) {
            sentences = internationalizationRepository.findAllByLanguage(language);
        } else if (language == null) {
            sentences = internationalizationRepository.findAllByAbbreviation(abbreviation);
        } else {
            sentences = internationalizationRepository.findByAbbreviationAndLanguage(abbreviation, language);
        }

        if (sentences != null) {
            return new ResponseEntity<>(sentences, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "api/internationalization/resources", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String getInternationalizationResources() {

        JSONObject resources = new JSONObject();

        List<String> availableLangs = new ArrayList<>();

        Iterable<Internationalization> resourceList = internationalizationRepository.findAll();

        resourceList.forEach(internationalization -> {
            if (!availableLangs.contains(internationalization.getLanguage())) {
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
    public void populateTableInternationalization() {
        List<String> langs = new ArrayList<>();
        langs.add("se");
        langs.add("en");
        langs.add("jp");
        JSONParser jsonParser = new JSONParser();

        langs.forEach(lang -> {
            try {
                Object object = jsonParser.parse(new FileReader("src/main/resources/locales/" + lang + "/translation.json"));
                org.json.simple.JSONObject jsonObject = (org.json.simple.JSONObject) object;
                Object object2 = jsonObject.get("translations");
                org.json.simple.JSONObject jsonObject2 = (org.json.simple.JSONObject) object2;
                Iterable<String> jsonKeys = jsonObject2.keySet();
                jsonKeys.forEach(key -> {
                    Internationalization i18n = new Internationalization();
                    i18n.setLanguage(lang);
                    i18n.setAbbrievation(key);
                    i18n.setSentence(jsonObject2.get(key).toString());
                    internationalizationRepository.save(i18n);
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

    }

    @RequestMapping(value = "api/internationalization/generateJSONFromDB", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public void generateJSONFromDB() {

        List<String> availableLangs = new ArrayList<>();

        Iterable<Settings> resList = settingsRepository.findAll();
        resList.forEach(settings -> {
            if (!availableLangs.contains(settings.getLanguage_code())) {
                availableLangs.add(settings.getLanguage_code());
            }
        });
        availableLangs.forEach(lang -> {
            Path pathDir = Paths.get(System.getProperty("user.dir") + "/src/main/resources/locales/" + lang);
            Path pathFile = Paths.get(System.getProperty("user.dir") + "/src/main/resources/locales/" + lang + "/translation.json");
            if (Files.exists(pathDir)) {
                populateTranslationFile(lang, pathFile);
            } else {
                System.out.println(pathDir + " does not exist. Will create the folder now...");
                File dir = new File(pathDir.toString());
                try {
                    if (dir.mkdir()) {
                        System.out.println("Successfully created folder: " + pathDir);
                        System.out.println("Will now create translation.json within the folder...");
                        populateTranslationFile(lang, pathFile);
                    } else {
                        System.out.println("Failed to create folder: " + pathDir);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private void populateTranslationFile(String lang, Path pathFile) {
        Iterable<Internationalization> resList = internationalizationRepository.findAllByLanguage(lang);

        File file = new File(pathFile.toString());
        JSONObject jsonObject = new JSONObject();
        JSONObject jsonObject2 = new JSONObject();
        try {
            FileWriter fw = new FileWriter(file);

            resList.forEach(resource -> jsonObject2.put(resource.getAbbreviation(), resource.getSentence()));

            jsonObject.put("translations", jsonObject2);

            fw.write(jsonObject.toString(2));
            fw.flush();
            fw.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
