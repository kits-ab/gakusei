package se.kits.gakusei.user.repository;

import org.springframework.data.repository.CrudRepository;

import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.user.model.NuggetType;
import se.kits.gakusei.user.model.ProgressTracking;
import se.kits.gakusei.user.model.User;

import java.util.List;

public interface ProgressTrackingRepository
    extends CrudRepository<ProgressTracking, Long> {

    ProgressTracking findByUserAndNuggetID(User user, String nuggetID);

    List<ProgressTracking> findAllByUserUsernameAndLatestResultAndNuggetTypeEquals(String user, Boolean latestResult, NuggetType nuggetType);

    // Hämtar alla genom latest_result och username
    List<ProgressTracking> findAllByLatestResultAndUserUsernameEquals(Boolean latestResult, String username);

}

