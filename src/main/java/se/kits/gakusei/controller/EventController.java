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
import se.kits.gakusei.dto.EventDTO;
import se.kits.gakusei.user.model.Event;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.EventRepository;
import se.kits.gakusei.user.repository.UserRepository;

import java.sql.Timestamp;

@RestController
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${gakusei.event-logging}")
    private boolean eventLogging;

    @RequestMapping(
            value = "/api/events",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Iterable<Event>> getEvents(){
        Iterable events = eventRepository.findAll();
        if(events != null){
            return new ResponseEntity<Iterable<Event>>(events, HttpStatus.OK);
        }else{
            return new ResponseEntity<Iterable<Event>>(HttpStatus.FORBIDDEN);
        }
    }

    @RequestMapping(
            value = "/api/events",
            method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Event> addEvent(@RequestBody EventDTO eventDTO){
        if (!eventLogging) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        Event event = new Event();
        User user = userRepository.findByUsername(eventDTO.getUsername());
        if(user != null){
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
            eventRepository.save(event);
            return new ResponseEntity<>(HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
