package se.kits.gakuseiStat.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatAppController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
        return "Greetings from Gakusei StatApp! Navigate to /events to see all events. Navigate to /events/{type} to get events by type." +
                " Type can be question, alternative, userAnswer, correctAnswer or answeredCorrectly.";
    }

}