package se.kits.gakusei.controller;

import io.swagger.annotations.Api;
import org.json.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import se.kits.gakusei.content.model.Internationalization;
import se.kits.gakusei.content.model.Settings;
import se.kits.gakusei.content.repository.InternationalizationRepository;
import se.kits.gakusei.content.repository.SettingsRepository;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.UserRepository;

import javax.annotation.PostConstruct;
import java.io.FileReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@Api(value="InternationalizationController", description="Operations for handling internationalization")
public class InternationalizationController {

    private final InternationalizationRepository internationalizationRepository;

    private final SettingsRepository settingsRepository;

    private final UserRepository userRepository;

    private HashMap<String, String> langMap = new HashMap<>();

    @Autowired
    public InternationalizationController(InternationalizationRepository internationalizationRepository, SettingsRepository settingsRepository, UserRepository userRepository) {
        this.internationalizationRepository = internationalizationRepository;
        this.settingsRepository = settingsRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void init() {
        System.out.println("Initializing...");
        generateJSONFromDB();
    }


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

    @RequestMapping(value = "/resources/locales/{lang}/translation.json", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String getInternationalizationResource(@PathVariable("lang") String lang) {
        System.out.println("Map: " + langMap.get(lang));
        return langMap.get(lang);
    }

    @RequestMapping(value = "/resources/locales/index.js", method = RequestMethod.GET,
            produces = MediaType.ALL_VALUE)
    public String getInternationalizationResource() {
        System.out.println("index.js");
        return "//This file is used by alienfast/i18next-loader as a root pointer.";
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
            System.out.println(settings.getLanguage_code());
            if (!availableLangs.contains(settings.getLanguage_code())) {
                availableLangs.add(settings.getLanguage_code());
            }
        });
        availableLangs.forEach(this::populateTranslationFile);
//            Path pathDir = Paths.get(System.getProperty("user.dir") + "/src/main/resources/locales/" + lang);
//            Path pathFile = Paths.get(System.getProperty("user.dir") + "/src/main/resources/locales/" + lang + "/translation.json");
//            if (Files.exists(pathDir)) {
//                populateTranslationFile(lang, pathFile);
//            } else {
//                System.out.println(pathDir + " does not exist. Will create the folder now...");
//                File dir = new File(pathDir.toString());
//                try {
//                    if (dir.mkdir()) {
//                        System.out.println("Successfully created folder: " + pathDir);
//                        System.out.println("Will now create translation.json within the folder...");
//                        populateTranslationFile(lang, pathFile);
//                    } else {
//                        System.out.println("Failed to create folder: " + pathDir);
//                    }
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//            }
//        });
    }

    private void populateTranslationFile(String lang) {
        Iterable<Internationalization> resList = internationalizationRepository.findAllByLanguage(lang);

//        File file = new File(pathFile.toString());
        JSONObject jsonObject = new JSONObject();
        JSONObject jsonObject2 = new JSONObject();
        try {
            StringWriter fw = new StringWriter();
            resList.forEach(resource -> jsonObject2.put(resource.getAbbreviation(), resource.getSentence()));
            jsonObject.put("translations", jsonObject2);
            fw.write(jsonObject.toString(2));
            fw.flush();
            fw.close();
            langMap.put(lang, fw.getBuffer().toString());
            System.out.println(fw.getBuffer().toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/api/checkUserLanguage", method = RequestMethod.POST)
    public ResponseEntity<String> checkUserLanguage(@RequestBody String username) {
        String siteLanguage = userRepository.findByUsername(username).getSiteLanguage();
        if (siteLanguage != null && siteLanguage.length() > 0) {
            return new ResponseEntity<>(siteLanguage, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(siteLanguage, HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(value = "/api/saveUserLanguage", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> saveUserLanguage(@RequestBody String userData) {
        try {
            JSONParser jsonParser = new JSONParser();
            org.json.simple.JSONObject jsonData = (org.json.simple.JSONObject) jsonParser.parse(userData);
            User user = userRepository.findByUsername(jsonData.get("username").toString());
            user.setSiteLanguage(jsonData.get("language").toString());
            userRepository.save(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
