package se.kits.gakusei.util;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.MockitoJUnitRunner;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.FactRepository;
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

    @Mock
    private FactRepository factRepository;

    @Mock
    private ProgressTracking progressTrackingMock;

    @Captor
    private ArgumentCaptor<User> userCaptor;

    @Captor
    private ArgumentCaptor<Nugget> nuggetCaptor;

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
    private String testQuestion;
    private List<Nugget> nuggets;
    private ProgressTracking progressTracking;
    private long correctCount;
    private long incorrectCount;

    @Before
    public void setUp() throws Exception{
        progressHandler = new ProgressHandler();
        MockitoAnnotations.initMocks(this);

        username = "testname";
        password = "testpassword";
        role = "testrole";
        testQuestion = "swe_test1";
        nuggets = generateNuggets();
        correctCount = 10L;
        incorrectCount = 20L;

        gamemode = "testmode";
        timestamp = 1485267234671L;
        user = new User(username, password, role);

    }

    public Event createEvent(long timestamp, User user, String gamemode, String type, String data){
        Event event = new Event();
        event.setTimestamp(new Timestamp(timestamp));
        event.setUser(user);
        event.setGamemode(gamemode);
        event.setType(type);
        event.setData(data);
        return event;
    }

    public ProgressTracking createProgressTracking(User user,
                                                   Nugget nugget,
                                                   long correctCount,
                                                   long incorrectCount,
                                                   Timestamp latestTimestamp,
                                                   boolean latestResult) {

        ProgressTracking pt = new ProgressTracking();
        pt.setUser(user);
        pt.setNugget(nugget);
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
                createProgressTracking(user, nuggets.get(1), correctCount, incorrectCount, timestampSql, true);
        ProgressTracking spyPT = spy(progressTracking);
        Event event = createEvent(timestamp, user, gamemode, "answeredCorrectly", "true");
        when(userRepository.findByUsername(username)).thenReturn(user);
        when(eventRepository.getLatestQuestionForUser(username)).thenReturn(testQuestion);
        when(factRepository.findNuggetsByFactData(testQuestion)).thenReturn(nuggets);
        when(progressTrackingRepository.findProgressTrackingByUserAndNugget(user, nuggets.get(1))).thenReturn(spyPT);
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
                createProgressTracking(user, nuggets.get(1), correctCount, incorrectCount, timestampSql, true);
        ProgressTracking spyPT = spy(progressTracking);
        Event event = createEvent(timestamp, user, gamemode, "answeredCorrectly", "false");
        when(userRepository.findByUsername(username)).thenReturn(user);
        when(eventRepository.getLatestQuestionForUser(username)).thenReturn(testQuestion);
        when(nuggetRepository.findAll()).thenReturn(nuggets);
        when(progressTrackingRepository.findProgressTrackingByUserAndNugget(user, nuggets.get(1))).thenReturn(spyPT);
        when(eventRepository.getLatestAnswerTimestamp(username)).thenReturn(timestampSql);
        when(factRepository.findNuggetsByFactData(testQuestion)).thenReturn(nuggets);
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
        Event event = createEvent(timestamp, user, gamemode, "answeredCorrectly", "true");
        when(userRepository.findByUsername(username)).thenReturn(user);
        when(eventRepository.getLatestQuestionForUser(username)).thenReturn(testQuestion);
        when(nuggetRepository.findAll()).thenReturn(nuggets);
        when(progressTrackingRepository.findProgressTrackingByUserAndNugget(user, nuggets.get(1))).thenReturn(null);
        when(eventRepository.getLatestAnswerTimestamp(username)).thenReturn(timestampSql);
        when(factRepository.findNuggetsByFactData(testQuestion)).thenReturn(nuggets);
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
        Event event = createEvent(timestamp, user, gamemode, "answeredCorrectly", "false");
        when(userRepository.findByUsername(username)).thenReturn(user);
        when(eventRepository.getLatestQuestionForUser(username)).thenReturn(testQuestion);
        when(nuggetRepository.findAll()).thenReturn(nuggets);
        when(progressTrackingRepository.findProgressTrackingByUserAndNugget(user, nuggets.get(1))).thenReturn(null);
        when(eventRepository.getLatestAnswerTimestamp(username)).thenReturn(timestampSql);
        when(factRepository.findNuggetsByFactData(testQuestion)).thenReturn(nuggets);
        progressHandler.trackProgress(event);
        verify(progressTrackingRepository).save(progressTrackingArgumentCaptor.capture());
        ProgressTracking ptFromCaptor = progressTrackingArgumentCaptor.getValue();
        assertEquals(0L, ptFromCaptor.getCorrectCount());
        assertEquals(1L, ptFromCaptor.getIncorrectCount());
        assertEquals(timestamp, ptFromCaptor.getLatestTimestamp().getTime());
        assertEquals(Boolean.parseBoolean(event.getData()), ptFromCaptor.isLatestResult());
    }
}
