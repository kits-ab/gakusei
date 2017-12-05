package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.model.WordType;

import java.util.List;

public interface NuggetRepository extends CrudRepository<Nugget, String> {

    List<Nugget> findAll();

    List<Nugget> findByWordType(WordType wordType);

}