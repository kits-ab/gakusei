package se.kits.gakusei.controller;

import static org.junit.Assert.*;
import static org.mockito.Matchers.any;

import static org.mockito.Mockito.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.ResponseEntity;
import se.kits.gakusei.dto.EventDTO;
import se.kits.gakusei.user.model.Event;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.EventRepository;
import se.kits.gakusei.user.repository.UserRepository;

import java.lang.reflect.Field;
import java.sql.Timestamp;

@RunWith(MockitoJUnitRunner.class)
public class EventControllerTest {

    @InjectMocks
    private EventController eventController;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    private EventDTO eventDTO;
    private Event event;
    private String username;
    private String password;
    private String role;
    private String gamemode;
    private String type;
    private String data;
    private long timestamp;
    private User user;

    @Before
    public void setUp() throws Exception{
        eventController = new EventController();
        MockitoAnnotations.initMocks(this);

        // Some reflection to set the private and @Value-annotated boolean field 'eventLogging' in EventController
        Field valueAnnotationEventLogging = EventController.class.getDeclaredField("eventLogging");
        valueAnnotationEventLogging.setAccessible(true);
        valueAnnotationEventLogging.set(eventController, true);

        username = "testname";
        password = "testpassword";
        role = "testrole";

        gamemode = "testmode";
        type = "testtype";
        data = "testdata";
        timestamp = 1485267234671L;
        user = new User(username, password, role);

        eventDTO = new EventDTO();
        eventDTO.setUsername(username);
        eventDTO.setGamemode(gamemode);
        eventDTO.setType(type);
        eventDTO.setData(data);
        eventDTO.setTimestamp(timestamp);
    }

    public Event createEvent(long timestamp, User user, String gamemode, String type, String data){
        Event event = new Event();
        event.setTimestamp(new Timestamp(timestamp));
        event.setUser(user);
        event.setGamemode(gamemode);
        event.setType(type);
        event.setData(data);
        return event;
    }

    @Test
    public void testAddEventOK() throws Exception{
        Event event = createEvent(timestamp, user, gamemode, type, data);
        when(userRepository.findByUsername(eventDTO.getUsername())).thenReturn(user);
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        ResponseEntity<Event> re = eventController.addEvent(eventDTO);
        assertEquals(200, re.getStatusCodeValue());
    }

    @Test
    public void testAddEventNoUser() throws Exception{
        when(userRepository.findByUsername(username)).thenReturn(null);
        ResponseEntity<Event> re = eventController.addEvent(eventDTO);
        assertEquals(500, re.getStatusCodeValue());
    }
}
