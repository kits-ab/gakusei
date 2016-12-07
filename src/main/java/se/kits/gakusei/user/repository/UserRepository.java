package se.kits.gakusei.user.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.user.model.User;

public interface UserRepository extends CrudRepository<User, Long> {
}
