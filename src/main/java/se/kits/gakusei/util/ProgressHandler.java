package se.kits.gakusei.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import se.kits.gakusei.user.model.Event;
import se.kits.gakusei.user.model.ProgressTracking;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.EventRepository;
import se.kits.gakusei.user.repository.ProgressTrackingRepository;
import se.kits.gakusei.user.repository.UserRepository;

import java.sql.Timestamp;

@Component
public class ProgressHandler {

    private Logger logger = LoggerFactory.getLogger(ProgressHandler.class);

    @Value("${gakusei.retention-factor-min}")
    private double retFactorMin;

    @Value("${gakusei.retention-mode}")
    private boolean retentionMode;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProgressTrackingRepository progressTrackingRepository;

    public void trackProgress(Event event) {
        if (event.getNuggetId() == null) {
            return;
        }

        User user = userRepository.findByUsername(event.getUser().getUsername());
        Timestamp latestTS = eventRepository.getLatestAnswerTimestamp(user.getUsername());

        ProgressTracking pt = progressTrackingRepository.findByUserAndNuggetID(user,
                event.getNuggetId());
        if (pt != null) {
            if (event.getData().trim().equalsIgnoreCase("true")) {
                pt.setCorrectCount(pt.getCorrectCount() + 1L);
            } else {
                pt.setIncorrectCount(pt.getIncorrectCount() + 1L);
            }
        } else {
            pt = new ProgressTracking();
            pt.setUser(user);
            pt.setNuggetID(event.getNuggetId());
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

        if (retentionMode) {
            updateRetention(event, pt);
        }
    }

    private void updateRetention(Event event, ProgressTracking pt) {

        // Magic numbers in here are from the Super Memo 2 implementation article.
        String username = event.getUser().getUsername();
        String nuggetId = event.getNuggetId();
        int timePeriod = eventRepository.getAnswerTimePeriod(username, nuggetId);

        double retFactor = pt.getRetentionFactor();
        int quality = 1;
        if (event.getData().trim().equalsIgnoreCase("true")) {
            if (timePeriod < 5) {
                quality = 5;
            } else if(timePeriod < 10) {
                quality = 4;
            } else {
                quality = 3;
            }
        }
        retFactor = Math.max(retFactor - 0.8 + 0.28 * quality - 0.02 * quality * quality, retFactorMin);

        double retInterval = pt.getRetentionInterval();

        if (retInterval < 2) {
            if (retInterval == 0) {
                retInterval = 1;
            } else if (retInterval == 1) {
                retInterval = 2;
            }
        } else {
            // Update the retention interval to I(n) := I(n-1) * retentionFactor, with random fuzz to avoid patterns
            retInterval = retInterval * retFactor + (Math.random() / 4);
        }

        Timestamp retTimeStamp = pt.getLatestTimestamp();
        retTimeStamp.setTime(Math.round(retTimeStamp.getTime()+retInterval*24*3600*1000));

        pt.setRetentionFactor(retFactor);
        pt.setRetentionInterval(retInterval);
        pt.setRetentionDate(retTimeStamp);
        progressTrackingRepository.save(pt);
    }
}
