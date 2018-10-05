package se.kits.gakusei.user.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.user.model.NuggetType;

public interface NuggetTypeRepository
        extends CrudRepository<NuggetType, Long> {

        NuggetType findById(long id);
        NuggetType findByType(String type);
}