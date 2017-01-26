package se.kits.gakusei.user.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import se.kits.gakusei.user.model.User;

@RestResource(exported=false)
public interface UserRepository extends CrudRepository<User, String> {
    User findByUsername(String username);

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    Iterable<User> findAll();
}
