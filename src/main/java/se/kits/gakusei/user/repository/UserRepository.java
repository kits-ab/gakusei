package se.kits.gakusei.user.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import se.kits.gakusei.user.model.User;

public interface UserRepository extends CrudRepository<User, Long> {
    User findByUsername(String username);

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    Iterable<User> findAll();

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    User findOne(Long aLong);
}
