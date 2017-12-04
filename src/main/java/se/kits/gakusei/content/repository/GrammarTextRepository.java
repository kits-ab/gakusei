package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.GrammarText;

public interface GrammarTextRepository extends CrudRepository<GrammarText, String> {
}
