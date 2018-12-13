package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Settings;

public interface SettingsRepository extends CrudRepository<Settings, Long> {

    Settings findById(long id);
}
