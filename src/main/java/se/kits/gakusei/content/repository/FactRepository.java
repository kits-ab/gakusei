package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Fact;

/**
 * Created by David Chang on 2016-12-06.
 */
public interface FactRepository extends CrudRepository<Fact, Long> {
}
