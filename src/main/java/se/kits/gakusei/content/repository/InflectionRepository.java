package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Inflection;

public interface InflectionRepository extends CrudRepository<Inflection, Long> {
}
