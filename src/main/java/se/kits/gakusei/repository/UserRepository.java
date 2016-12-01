package se.kits.gakusei.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.model.User;

public interface UserRepository extends CrudRepository<User, Long> {
}
