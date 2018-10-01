package se.kits.gakuseiStat.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import se.kits.gakuseiStat.Model.Events;
import se.kits.gakuseiStat.Service.EventsService;

import java.util.List;

@RestController
public class EventsController {

    @Autowired
    private EventsService eventsService;

    @RequestMapping(value = "/events", method = RequestMethod.GET, produces = "application/json")
    public List<Events> getAllEvents(){
        return eventsService.getAllEvents();
    }

    @RequestMapping(value = "/events/{type}", method = RequestMethod.GET, produces = "application/json")
    public List<Events> getEventsByType(@PathVariable String type){
        return eventsService.getEventsByType(type);
    }
}
