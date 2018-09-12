package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import se.kits.gakusei.content.model.Announcement;

import java.time.LocalDateTime;
import java.util.List;

public interface AnnouncementRepository
        extends CrudRepository<Announcement, Long> {

    List<Announcement> findAnnouncementByStartDateIsBeforeAndEndDateIsAfter(
            @Param("date")
                    LocalDateTime username
    );

}
