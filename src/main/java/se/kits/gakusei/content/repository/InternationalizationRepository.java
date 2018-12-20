package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Internationalization;

import java.util.List;

public interface InternationalizationRepository extends CrudRepository<Internationalization, Long> {

    List<Internationalization> findByAbbreviationAndLanguage(String abbreviation, String language);

    List<Internationalization> findAllByAbbreviation(String abbreviation);

    List<Internationalization> findAllByLanguage(String language);
}
