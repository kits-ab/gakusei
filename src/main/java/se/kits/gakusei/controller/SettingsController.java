package se.kits.gakusei.controller;

import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.kits.gakusei.content.model.Settings;
import se.kits.gakusei.content.repository.SettingsRepository;

@RestController
@Api(value="SettingsController", description="Operations for handling user language settings")
public class SettingsController {

    @Autowired
    private SettingsRepository settingsRepository;

    @RequestMapping(value = "api/settings", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<Iterable<Settings>> getSettings(
            @RequestParam(value = "language", required = false) String language){

        Iterable<Settings> settings;

        if(language == null){
            settings = settingsRepository.findAllEnabled();
        }else{
            settings = settingsRepository.findByLanguage(language);
        }



        if(settings != null){
            return new ResponseEntity<>(settings, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
