package se.kits.gakusei.user.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import se.kits.gakusei.user.model.Event;

public interface EventRepository extends CrudRepository<Event, Long> {


    Integer getUserSuccessRate(@Param("username") String username);

    String getLatestNuggetForUser(@Param("username") String username);
}
