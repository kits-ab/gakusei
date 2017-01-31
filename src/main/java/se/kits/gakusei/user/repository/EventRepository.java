package se.kits.gakusei.user.repository;

import org.hibernate.annotations.NamedNativeQuery;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import se.kits.gakusei.user.model.Event;

import java.sql.Timestamp;

public interface EventRepository extends CrudRepository<Event, Long> {


    Integer getUserSuccessRate(@Param("username") String username);

    String getLatestQuestionForUser(@Param("username") String username);

    Timestamp getLatestAnswerTimestamp(@Param("username") String username);
}
