package se.kits.gakusei.controller;

import java.sql.Timestamp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import se.kits.gakusei.dto.EventDTO;
import se.kits.gakusei.user.model.Event;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.EventRepository;
import se.kits.gakusei.user.repository.UserRepository;
import se.kits.gakusei.util.ProgressHandler;

@RestController
public class EventController {
    private Logger logger = LoggerFactory.getLogger(EventController.class);

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProgressHandler progressHandler;

    @Value("${gakusei.event-logging}")
    private boolean eventLogging;

    @RequestMapping(
        value = "/api/events",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Iterable<Event>> getEvents() {
        Iterable events = eventRepository.findAll();
        return (events != null) ? new ResponseEntity<Iterable<Event>>(
            events,
            HttpStatus.OK
        ) : new ResponseEntity<Iterable<Event>>(HttpStatus.FORBIDDEN);
    }

    @RequestMapping(
        value = "/api/events2",
        method = RequestMethod.POST,
        consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Event> addEvents(
        @RequestBody
        EventDTO[] eventDTOs
    ) {
        for (EventDTO eventDTO : eventDTOs) {
            ResponseEntity<Event> response = this.addEvent(eventDTO);
            if (!response.getStatusCode().is2xxSuccessful(

            )) {// Stop iterating if we run into errors

                return response;
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(
        value = "/api/events",
        method = RequestMethod.POST,
        consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Event> addEvent(
        @RequestBody
        EventDTO eventDTO
    ) {
        if (!eventLogging) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        Event event = new Event();
        User user = userRepository.findByUsername(eventDTO.getUsername());
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        event.setUser(user);
        event.setGamemode(eventDTO.getGamemode());
        event.setType(eventDTO.getType());
        event.setData(eventDTO.getData());
        event.setNuggetId(eventDTO.getNuggetid());
        event.setTimestamp(new Timestamp(eventDTO.getTimestamp()));
        logger.info(
            event.getTimestamp().toString() + " / " + event.getGamemode(

            ) + " / " + event.getType() + " / " + event.getData(

            ) + " / " + event.getNuggetId() + " / " + user.getUsername()
        );
        event = eventRepository.save(event);
        if (event.getType().equalsIgnoreCase("answeredCorrectly")) {
            progressHandler.trackProgress(event);
        }
        if (event.getType().equalsIgnoreCase("updateRetention")) {
            progressHandler.updateRetention(event);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

}

