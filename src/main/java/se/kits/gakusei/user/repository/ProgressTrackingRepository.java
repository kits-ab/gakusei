package se.kits.gakusei.user.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.user.model.ProgressTracking;
import se.kits.gakusei.user.model.User;

public interface ProgressTrackingRepository extends CrudRepository<ProgressTracking, Long>{
    ProgressTracking findProgressTrackingByUserAndNugget(User user, Nugget nugget);
}
