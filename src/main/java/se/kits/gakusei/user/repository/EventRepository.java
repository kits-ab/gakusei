package se.kits.gakusei.user.repository;

import java.sql.Timestamp;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import se.kits.gakusei.user.model.Event;

@RestResource(exported = false)
public interface EventRepository
    extends CrudRepository<Event, Long> {

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    Iterable<Event> findAll();

    Integer getUserSuccessRate(
        @Param("username")
        String username
    );

    Timestamp getLatestAnswerTimestamp(
        @Param("username")
        String username
    );

    Integer getAnswerTimePeriod(
        @Param("username")
        String username,
        @Param("nugget_id")
        String nugget_id
    );

}

