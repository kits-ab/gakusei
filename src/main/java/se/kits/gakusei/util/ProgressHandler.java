package se.kits.gakusei.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.FactRepository;
import se.kits.gakusei.user.model.Event;
import se.kits.gakusei.user.model.ProgressTracking;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.EventRepository;
import se.kits.gakusei.user.repository.ProgressTrackingRepository;
import se.kits.gakusei.user.repository.UserRepository;

import java.sql.Timestamp;

@Component
public class ProgressHandler {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProgressTrackingRepository progressTrackingRepository;

    @Autowired
    private FactRepository factRepository;

    public void trackProgress(Event event) {

        User user = userRepository.findByUsername(event.getUser().getUsername());
        Timestamp latestTS = eventRepository.getLatestAnswerTimestamp(user.getUsername());
        String latestQuestion = eventRepository.getLatestQuestionForUser(user.getUsername());
        Nugget nugget = factRepository.findNuggetsByFactData(latestQuestion).stream()
                .filter(n -> !n.isHidden())
                .findFirst().orElse(null);

        if (nugget != null) {
            String nuggetID = nugget.getId();
            ProgressTracking pt = progressTrackingRepository.findProgressTrackingByUserAndNuggetID(user, nuggetID);
            if (pt != null) {
                if (event.getData().trim().equalsIgnoreCase("true")) {
                    pt.setCorrectCount(pt.getCorrectCount() + 1L);
                } else {
                    pt.setIncorrectCount(pt.getIncorrectCount() + 1L);
                }
            } else {
                pt = new ProgressTracking();
                pt.setUser(user);
                pt.setNuggetID(nuggetID);
                if (event.getData().trim().equalsIgnoreCase("true")) {
                    pt.setCorrectCount(1L);
                    pt.setIncorrectCount(0L);
                } else {
                    pt.setCorrectCount(0L);
                    pt.setIncorrectCount(1L);
                }
            }
            pt.setLatestTimestamp(latestTS);
            pt.setLatestResult(Boolean.parseBoolean(event.getData()));
            progressTrackingRepository.save(pt);
        }
    }
}
