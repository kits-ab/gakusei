package se.kits.gakusei.content.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Settings;

import java.util.List;

public interface SettingsRepository extends CrudRepository<Settings, Long> {

    List<Settings> findByLanguage(String language);

    //TODO find all by enabled = true
    @Query(value = "SELECT * from public.settings where enabled = true", nativeQuery = true)
    List<Settings> findAllEnabled();
}
