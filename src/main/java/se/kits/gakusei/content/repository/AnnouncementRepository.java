package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Announcement;

import java.util.List;

public interface AnnouncementRepository
        extends CrudRepository<Announcement, Long> {

}
