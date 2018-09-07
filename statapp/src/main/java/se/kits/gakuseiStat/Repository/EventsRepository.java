package se.kits.gakuseiStat.Repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakuseiStat.Model.Events;

import java.util.List;

public interface EventsRepository extends CrudRepository<Events, Integer> {

        List<Events> findByType(String type);

}
