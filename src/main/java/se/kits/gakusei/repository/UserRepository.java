package se.kits.gakusei.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.model.User;

/**
 * Created by Pär Svedberg on 2016-11-29.
 */
public interface UserRepository extends CrudRepository<User, Long> {
}
