package se.kits.gakuseiStat.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.kits.gakuseiStat.Model.Events;
import se.kits.gakuseiStat.Repository.EventsRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class EventsService {

    @Autowired
    private EventsRepository eventsRepository;

    public List<Events> getAllEvents(){
        List<Events> events = new ArrayList<>();
        eventsRepository.findAll().forEach(events::add);
        return events;
    }

    public List<Events> getEventsByType(String type){
        List<Events> events = new ArrayList<>();
        eventsRepository.findByType(type).forEach(events::add);
        return events;
    }
}
