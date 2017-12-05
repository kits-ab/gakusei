package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.GrammarText;

import java.util.List;

public interface GrammarTextRepository extends CrudRepository<GrammarText, String> {

    List<GrammarText> findByInflectionMethod(String inflectionMethod);
}
