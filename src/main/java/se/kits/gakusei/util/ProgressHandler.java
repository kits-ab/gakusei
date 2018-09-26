package se.kits.gakusei.util;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import se.kits.gakusei.content.model.Kanji;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.KanjiRepository;
import se.kits.gakusei.content.repository.NuggetRepository;
import se.kits.gakusei.user.model.Event;
import se.kits.gakusei.user.model.ProgressTracking;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.EventRepository;
import se.kits.gakusei.user.repository.ProgressTrackingRepository;
import se.kits.gakusei.user.repository.UserRepository;

@Component
public class ProgressHandler {
    private Logger logger = LoggerFactory.getLogger(ProgressHandler.class);

    @Value("${gakusei.retention-factor-min}")
    private double retFactorMin;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProgressTrackingRepository progressTrackingRepository;

    @Autowired
    private NuggetRepository nuggetRepository;

    @Autowired
    private KanjiRepository kanjiRepository;

    public void trackProgress(Event event) {
        if (event.getNuggetId() == null) {
            return;
        }
        User user = userRepository.findByUsername(
            event.getUser().getUsername()
        );
        Timestamp latestTS = eventRepository.getLatestAnswerTimestamp(
            user.getUsername()
        );

        ProgressTracking pt = progressTrackingRepository.findByUserAndNuggetID(
            user,
            event.getNuggetId()
        );
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
    }

    public void updateRetention(Event event) {
        User user = userRepository.findByUsername(
            event.getUser().getUsername()
        );
        ProgressTracking pt = progressTrackingRepository.findByUserAndNuggetID(
            user,
            event.getNuggetId()
        );

        // Magic numbers in here are from the Super Memo 2 implementation article.
        String username = event.getUser().getUsername();
        String nuggetId = event.getNuggetId();
        int timePeriod = eventRepository.getAnswerTimePeriod(
            username,
            nuggetId
        );

        double retFactor = pt.getRetentionFactor();
        int quality = 1;
        if (event.getData().trim().equalsIgnoreCase("true")) {
            if (timePeriod < 5) {
                quality = 5;
            } else if (timePeriod < 10) {
                quality = 4;
            } else {
                quality = 3;
            }
        }
        retFactor = Math.max(
            retFactor - 0.8 + 0.28 * quality - 0.02 * quality * quality,
            retFactorMin
        );

        double retInterval = pt.getRetentionInterval();

        if (retInterval < 1) {
            if (retInterval == 0) {
                retInterval = 0.04167;
            } else {
                retInterval = 1;
            }
        } else {
            // Update the retention interval to I(n) := I(n-1) * retentionFactor, with random fuzz to avoid patterns
            retInterval = retInterval * retFactor + (Math.random() / 24);
        }
        Timestamp retTimeStamp = pt.getLatestTimestamp();
        retTimeStamp.setTime(
            Math.round(retTimeStamp.getTime() + retInterval * 24 * 3600 * 1000)
        );

        pt.setRetentionFactor(retFactor);
        pt.setRetentionInterval(retInterval);
        pt.setRetentionDate(retTimeStamp);
        progressTrackingRepository.save(pt);
    }

    //kollar vilka svar som är felsvarade
    public List<Nugget> getWrongQuestions(String username, String lessonType){
        // skapar lista från tabellen progresstracking
        List<ProgressTracking> allProgress = new ArrayList<>();
        // hämtar alla med latest_result = false och det username man får in och lägger i en lista
        progressTrackingRepository.findAllByLatestResultAndUserUsernameEquals(false, username).forEach(allProgress::add);
            List<Nugget> wrongNuggets = new ArrayList<>();
            Iterable<Nugget> guesslist = nuggetRepository.findAll();
            //itererar igenom alla items man fick från progresstracking och jämför med alla Nuggets för att hitta vilka som felsvar som är nuggets.
            for (ProgressTracking item : allProgress) {
                for (Nugget nugget : guesslist) {
                    if (item.getNuggetID().equals(nugget.getId())) {
                        wrongNuggets.add(nugget);
                    }
                }
            }
            return wrongNuggets;
        //returnerar en lista av nuggets som en viss användare har svarat fel på.
    }
    public List<Kanji> getWrongKanji(String username){
        // skapar lista från tabellen progresstracking
        List<ProgressTracking> allProgress = new ArrayList<>();
        // hämtar alla med latest_result = false och det username man får in och lägger i en lista
        progressTrackingRepository.findAllByLatestResultAndUserUsernameEquals(false, username).forEach(allProgress::add);
        List<Kanji> wrongKanji = new ArrayList<>();
        Iterable<Kanji> guesslist = kanjiRepository.findAll();
        //itererar igenom alla items man fick från progresstracking och jämför med alla Nuggets för att hitta vilka som felsvar som är nuggets.
        for (ProgressTracking item : allProgress) {
            for (Kanji kanji : guesslist) {
                if (item.getNuggetID().equals(kanji.getId())) {
                    wrongKanji.add(kanji);
                }
            }
        }
        return wrongKanji;
    }
    public HashMap<String,Integer> getWrongCount(String username){
        List<ProgressTracking> allIncorrectNuggets = new ArrayList<>();
        progressTrackingRepository.findAllByLatestResultAndUserUsernameEquals(false, username).forEach(allIncorrectNuggets::add);
        List<Nugget> wrongNuggets = new ArrayList<>();
        List<Kanji> wrongKanjis= new ArrayList<>();
        Iterable<Nugget> allNuggets = nuggetRepository.findAll();
        Iterable<Kanji> allKanji = kanjiRepository.findAll();
        //itererar igenom alla items man fick från progresstracking och jämför med alla Nuggets för att hitta vilka som felsvar som är nuggets.
        for (ProgressTracking item : allIncorrectNuggets) {
            for (Nugget nugget : allNuggets) {
                if (item.getNuggetID().equals(nugget.getId())) {
                    wrongNuggets.add(nugget);
                    //allIncorrectNuggets.remove(item);
                }
            }
        }if (!allIncorrectNuggets.isEmpty()){
            for (ProgressTracking item : allIncorrectNuggets) {
                for (Kanji kanji : allKanji) {
                    if (item.getNuggetID().equals(kanji.getId())) {
                        wrongKanjis.add(kanji);
                    }
                }
            }
        }
        HashMap<String, Integer> incorrectAnswerCount = new HashMap<>();
        incorrectAnswerCount.put("incorrectQuestions",wrongNuggets.size());
        incorrectAnswerCount.put("incorrectKanjis",wrongKanjis.size());
        return incorrectAnswerCount;
    }
}

