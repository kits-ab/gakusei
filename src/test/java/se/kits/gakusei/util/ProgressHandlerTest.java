package se.kits.gakusei.util;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.MockitoJUnitRunner;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.NuggetRepository;
import se.kits.gakusei.user.model.Event;
import se.kits.gakusei.user.model.ProgressTracking;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.EventRepository;
import se.kits.gakusei.user.repository.ProgressTrackingRepository;
import se.kits.gakusei.user.repository.UserRepository;

import java.sql.Timestamp;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static se.kits.gakusei.test_tools.TestTools.generateNuggets;

@RunWith(MockitoJUnitRunner.class)
public class ProgressHandlerTest {

    @InjectMocks
    private ProgressHandler progressHandler;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NuggetRepository nuggetRepository;

    @Mock
    private ProgressTrackingRepository progressTrackingRepository;

    @Captor
    private ArgumentCaptor<Long> correctCountCaptor;

    @Captor
    private ArgumentCaptor<Long> incorrectCountCaptor;

    @Captor
    private ArgumentCaptor<Timestamp> latestTimestampCaptor;

    @Captor
    private ArgumentCaptor<Boolean> latestResultCaptor;

    @Captor
    private ArgumentCaptor<ProgressTracking> progressTrackingArgumentCaptor;

    private String username;
    private String password;
    private String role;
    private String gamemode;
    private long timestamp;
    private User user;
    private List<Nugget> nuggets;
    private long correctCount;
    private long incorrectCount;

    @Before
    public void setUp() throws Exception{
        progressHandler = new ProgressHandler();
        MockitoAnnotations.initMocks(this);

        username = "testname";
        password = "testpassword";
        role = "testrole";
        nuggets = generateNuggets();
        correctCount = 10L;
        incorrectCount = 20L;

        gamemode = "testmode";
        timestamp = 1485267234671L;
        user = new User(username, password, role);

    }

    public Event createEvent(long timestamp, User user, String gamemode, String type, String nuggetId, String data){
        Event event = new Event();
        event.setTimestamp(new Timestamp(timestamp));
        event.setUser(user);
        event.setGamemode(gamemode);
        event.setType(type);
        event.setNuggetId(nuggetId);
        event.setData(data);
        return event;
    }

    public ProgressTracking createProgressTracking(User user,
                                                   String nuggetID,
                                                   long correctCount,
                                                   long incorrectCount,
                                                   Timestamp latestTimestamp,
                                                   boolean latestResult) {

        ProgressTracking pt = new ProgressTracking();
        pt.setUser(user);
        pt.setNuggetID(nuggetID);
        pt.setCorrectCount(correctCount);
        pt.setIncorrectCount(incorrectCount);
        pt.setLatestTimestamp(latestTimestamp);
        pt.setLatestResult(latestResult);
        return pt;
    }

    @Test
    public void testProgressHandlerExistentAndCorrect() throws Exception {
        Timestamp timestampSql = new Timestamp(timestamp);
        ProgressTracking progressTracking =
                createProgressTracking(user, nuggets.get(1).getId(), correctCount, incorrectCount, timestampSql, true);
        ProgressTracking spyPT = spy(progressTracking);
        Event event = createEvent(timestamp, user, gamemode, "answeredCorrectly",nuggets.get(1).getId(), "true");
        when(userRepository.findByUsername(username)).thenReturn(user);
        when(progressTrackingRepository.findByUserAndNuggetID(user, nuggets.get(1).getId()))
                .thenReturn(spyPT);
        when(eventRepository.getLatestAnswerTimestamp(username)).thenReturn(timestampSql);
        progressHandler.trackProgress(event);
        verify(spyPT).setCorrectCount(correctCountCaptor.capture());
        verify(spyPT).setLatestTimestamp(latestTimestampCaptor.capture());
        verify(spyPT).setLatestResult(latestResultCaptor.capture());
        assertEquals(correctCount + 1L, correctCountCaptor.getValue().longValue());
        assertEquals(timestamp, latestTimestampCaptor.getValue().getTime());
        assertEquals(Boolean.parseBoolean(event.getData()), latestResultCaptor.getValue());
    }

    @Test
    public void testProgressHandlerExistentAndIncorrect() throws Exception {
        Timestamp timestampSql = new Timestamp(timestamp);
        ProgressTracking progressTracking =
                createProgressTracking(user, nuggets.get(1).getId(), correctCount, incorrectCount, timestampSql, true);
        ProgressTracking spyPT = spy(progressTracking);
        Event event = createEvent(timestamp, user, gamemode, "answeredCorrectly", nuggets.get(1).getId(), "false");
        when(userRepository.findByUsername(username)).thenReturn(user);
        when(nuggetRepository.findAll()).thenReturn(nuggets);
        when(progressTrackingRepository.findByUserAndNuggetID(user, nuggets.get(1).getId()))
                .thenReturn(spyPT);
        when(eventRepository.getLatestAnswerTimestamp(username)).thenReturn(timestampSql);
        progressHandler.trackProgress(event);
        verify(spyPT).setIncorrectCount(incorrectCountCaptor.capture());
        verify(spyPT).setLatestTimestamp(latestTimestampCaptor.capture());
        verify(spyPT).setLatestResult(latestResultCaptor.capture());
        assertEquals(incorrectCount + 1L, incorrectCountCaptor.getValue().longValue());
        assertEquals(timestamp, latestTimestampCaptor.getValue().getTime());
        assertEquals(Boolean.parseBoolean(event.getData()), latestResultCaptor.getValue().booleanValue());
    }

    @Test
    public void testProgressHandlerNonExistentAndCorrect() throws Exception {
        Timestamp timestampSql = new Timestamp(timestamp);
        Event event = createEvent(timestamp, user, gamemode, "answeredCorrectly", nuggets.get(1).getId(), "true");
        when(userRepository.findByUsername(username)).thenReturn(user);
        when(nuggetRepository.findAll()).thenReturn(nuggets);
        when(progressTrackingRepository.findByUserAndNuggetID(user, nuggets.get(1).getId()))
                .thenReturn(null);
        when(eventRepository.getLatestAnswerTimestamp(username)).thenReturn(timestampSql);
        progressHandler.trackProgress(event);
        verify(progressTrackingRepository).save(progressTrackingArgumentCaptor.capture());
        ProgressTracking ptFromCaptor = progressTrackingArgumentCaptor.getValue();
        assertEquals(1L, ptFromCaptor.getCorrectCount());
        assertEquals(0L, ptFromCaptor.getIncorrectCount());
        assertEquals(timestamp, ptFromCaptor.getLatestTimestamp().getTime());
        assertEquals(Boolean.parseBoolean(event.getData()), ptFromCaptor.isLatestResult());
    }

    @Test
    public void testProgressHandlerNonExistentAndIncorrect() throws Exception {
        Timestamp timestampSql = new Timestamp(timestamp);
        Event event = createEvent(timestamp, user, gamemode, "answeredCorrectly", nuggets.get(1).getId(), "false");
        when(userRepository.findByUsername(username)).thenReturn(user);
        when(nuggetRepository.findAll()).thenReturn(nuggets);
        when(progressTrackingRepository.findByUserAndNuggetID(user, nuggets.get(1).getId()))
                .thenReturn(null);
        when(eventRepository.getLatestAnswerTimestamp(username)).thenReturn(timestampSql);
        progressHandler.trackProgress(event);
        verify(progressTrackingRepository).save(progressTrackingArgumentCaptor.capture());
        ProgressTracking ptFromCaptor = progressTrackingArgumentCaptor.getValue();
        assertEquals(0L, ptFromCaptor.getCorrectCount());
        assertEquals(1L, ptFromCaptor.getIncorrectCount());
        assertEquals(timestamp, ptFromCaptor.getLatestTimestamp().getTime());
        assertEquals(Boolean.parseBoolean(event.getData()), ptFromCaptor.isLatestResult());
    }

    @Test
    public void testRetentionFactorCorrectFast() {
        retentionFactorHelperTester(2.5, 1, 2.6, "true");
    }

    @Test
    public void testRetentionFactorCorrectMedium() {
        retentionFactorHelperTester(2.5, 7, 2.5, "true");
    }

    @Test
    public void testRetentionFactorCorrectSlow() {
        retentionFactorHelperTester(2.5, 30, 2.36, "true");
    }

    @Test
    public void testRetentionFactorIncorrectFast() {
        retentionFactorHelperTester(2.5, 1, 1.96, "false");
    }

    @Test
    public void testRetentionFactorIncorrectMedium() {
        retentionFactorHelperTester(2.5, 7, 1.96, "false");
    }

    @Test
    public void testRetentionFactorIncorrectSlow() {
        retentionFactorHelperTester(2.5, 30, 1.96, "false");
    }

    @Test
    public void testRetentionIntervalAndDateFirst(){
        double interval = retentionIntervalAndDateHelperTester(0);
        assertEquals(0.04167,interval,0.000001);
    }

    @Test
    public void testRetentionIntervalAndDateSecond(){
        double interval = retentionIntervalAndDateHelperTester(0.04167);
        assertEquals(1,interval,0.000001);
    }

    @Test
    public void testRetentionIntervalAndDateThird(){
        double interval = retentionIntervalAndDateHelperTester(1);
        assertTrue(interval >= 2.6);
        assertTrue(interval <= 2.6 + (1d/24d));
    }


    private void retentionFactorHelperTester(double factor, int timeTaken, double expectedFactor, String answeredCorrectly) {
        Timestamp timestampSql = new Timestamp(timestamp);
        ProgressTracking progressTracking =
                createProgressTracking(user, nuggets.get(1).getId(), correctCount, incorrectCount, timestampSql, true);
        ProgressTracking spyPT = spy(progressTracking);
        Event event = createEvent(timestamp, user, gamemode, "answeredCorrectly", nuggets.get(1).getId(), answeredCorrectly);

        when(userRepository.findByUsername(username)).thenReturn(user);
        when(eventRepository.getAnswerTimePeriod(username, event.getNuggetId())).thenReturn(timeTaken);

        spyPT.setRetentionFactor(factor);

        progressHandler.updateRetention(event, spyPT);
        verify(progressTrackingRepository).save(progressTrackingArgumentCaptor.capture());
        ProgressTracking ptFromCaptor = progressTrackingArgumentCaptor.getValue();

        assertEquals(expectedFactor, ptFromCaptor.getRetentionFactor(),0.0000001);
    }

    private double retentionIntervalAndDateHelperTester(double interval) {
        Timestamp timestampSql = new Timestamp(timestamp);
        ProgressTracking progressTracking =
                createProgressTracking(user, nuggets.get(1).getId(), correctCount, incorrectCount, timestampSql, true);
        ProgressTracking spyPT = spy(progressTracking);
        Event event = createEvent(timestamp, user, gamemode, "answeredCorrectly", nuggets.get(1).getId(), "true");

        when(userRepository.findByUsername(username)).thenReturn(user);
        when(eventRepository.getAnswerTimePeriod(username, event.getNuggetId())).thenReturn(1);

        spyPT.setRetentionFactor(2.5);
        spyPT.setRetentionInterval(interval);

        progressHandler.updateRetention(event, spyPT);
        verify(progressTrackingRepository).save(progressTrackingArgumentCaptor.capture());
        ProgressTracking ptFromCaptor = progressTrackingArgumentCaptor.getValue();

        return ptFromCaptor.getRetentionInterval();
    }

}
