package se.kits.gakusei.content.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Fact;

import java.util.List;

public interface FactRepository extends CrudRepository<Fact, Long> {

    @Query("select distinct f.type from Fact f")
    List<String> getAllFactTypes();
}
