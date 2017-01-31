package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.FactRepository;
import se.kits.gakusei.content.repository.NuggetRepository;
import se.kits.gakusei.dto.EventDTO;
import se.kits.gakusei.user.model.Event;
import se.kits.gakusei.user.model.ProgressTracking;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.EventRepository;
import se.kits.gakusei.user.repository.ProgressTrackingRepository;
import se.kits.gakusei.user.repository.UserRepository;
import java.sql.Timestamp;

@RestController
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProgressTrackingRepository progressTrackingRepository;

    @Autowired
    private FactRepository factRepository;

    @Autowired
    private NuggetRepository nuggetRepository;

    @Value("${gakusei.event-logging}")
    private boolean eventLogging;

    @RequestMapping(
            value = "/api/events",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Iterable<Event>> getEvents() {
        Iterable events = eventRepository.findAll();
        return (events != null) ?
                new ResponseEntity<Iterable<Event>>(events, HttpStatus.OK) :
                new ResponseEntity<Iterable<Event>>(HttpStatus.FORBIDDEN);
    }

    @RequestMapping(
            value = "/api/events",
            method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Event> addEvent(@RequestBody EventDTO eventDTO) {
        if (!eventLogging) { return new ResponseEntity<>(HttpStatus.NO_CONTENT); }
        Event event = new Event();
        User user = userRepository.findByUsername(eventDTO.getUsername());
        if (user == null) { return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); }
        event.setUser(user);
        event.setGamemode(eventDTO.getGamemode());
        event.setType(eventDTO.getType());
        event.setData(eventDTO.getData());
        event.setTimestamp(new Timestamp(eventDTO.getTimestamp()));
        System.out.println(event.getTimestamp().toString()
                + " / " + event.getGamemode()
                + " / " + event.getType()
                + " / " + event.getData()
                + " / " + user.getUsername());
        event = eventRepository.save(event);
        if (event.getType().equalsIgnoreCase("answeredCorrectly")) {
            progressHandler(event);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void progressHandler(Event event) {

        User user = userRepository.findByUsername(event.getUser().getUsername());
        String latestQuestion = eventRepository.getLatestQuestionForUser(user.getUsername());
        Nugget nugget = nuggetRepository.findAll()
            .stream()
            .filter(n -> n.getFacts()
                    .stream()
                    .anyMatch(f -> f.getData().equalsIgnoreCase(latestQuestion)))
            .findFirst().get();

        if (nugget != null) {
            ProgressTracking pt = progressTrackingRepository.findProgressTrackingByUserAndNugget(user, nugget);
            if (pt != null) {
                if (event.getData().trim().equalsIgnoreCase("true")) {
                    pt.setCorrectCount(pt.getCorrectCount() + 1L);
                } else {
                    pt.setIncorrectCount(pt.getIncorrectCount() + 1L);
                }
            } else {
                pt = new ProgressTracking();
                pt.setUser(user);
                pt.setNugget(nugget);
                if (event.getData().trim().equalsIgnoreCase("true")) {
                    pt.setCorrectCount(1L);
                    pt.setIncorrectCount(0L);
                } else {
                    pt.setCorrectCount(0L);
                    pt.setIncorrectCount(1L);
                }
            }
            pt.setLatestTimestamp(eventRepository.getLatestAnswerTimestamp(user.getUsername()));
            pt.setLatestResult(Boolean.parseBoolean(event.getData()));
            progressTrackingRepository.save(pt);
        }
    }
}
