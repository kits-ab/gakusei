package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Settings;

import java.util.List;

public interface SettingsRepository extends CrudRepository<Settings, Long> {

    List<Settings> findByLanguage(String language);
}
