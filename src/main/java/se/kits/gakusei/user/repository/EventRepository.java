package se.kits.gakusei.user.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.user.model.Event;

public interface EventRepository extends CrudRepository<Event, Long>{
}
