package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Fact;

public interface FactRepository extends CrudRepository<Fact, Long> {
}
