/*
 * The Event class is used to make statistic conclusions of users behavior, results and exposure of words. The events
 * are sent from frontend when users makes choices or are exposed to data and are then logged.
 */
package se.kits.gakusei.user.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.*;

@Entity
@NamedNativeQueries(
    {
        @NamedNativeQuery(
            name = "Event.getUserSuccessRate",
            query = "select round( " + "coalesce( (count(case data when 'true' then 1 else null end) * 100.0) / nullif(count(*), 0), 0)) " + "from events " + "where user_ref = :username and type = 'answeredCorrectly'"
        )
        ,
        @NamedNativeQuery(
            name = "Event.getAnswerTimePeriod",
            query = "SELECT FLOOR(EXTRACT(EPOCH FROM timestamp_B.timestamp - timestamp_A.timestamp)) FROM\n" + "(SELECT timestamp FROM events WHERE type = 'answeredCorrectly' AND user_ref = :username AND nugget_id = :nugget_id\n" + "ORDER BY events.timestamp DESC LIMIT 1) AS timestamp_B,\n" + "(SELECT timestamp FROM events WHERE type = 'question' AND user_ref = :username AND nugget_id = :nugget_id\n" + "ORDER BY events.timestamp DESC LIMIT 1) AS timestamp_A"
        )
        ,
        // (SELECT timestamp FROM events WHERE userref == gunnargren as timestamp_A )
        @NamedNativeQuery(
            name = "Event.getLatestAnswerTimestamp",
            query = "SELECT timestamp " + "FROM events " + "WHERE type = 'userAnswer' AND user_ref = :username " + "ORDER BY events.timestamp " + "DESC " + "LIMIT 1"
        )

    }
)
@Table(name = "events")
public class Event implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private long id;

    @Column(nullable = false)
    private Timestamp timestamp;

    @Column(nullable = false)
    private String gamemode;

    @Column(nullable = false)
    private String type;
    // question, alternative, userAnswer, correctAnswer

    @Column(nullable = false)
    private String data;

    private String lesson;

    @Column
    private String nuggetId;

    @JoinColumn(name = "user_ref")
    @JsonBackReference(value = "events")
    @ManyToOne
    private User user;

    public Event() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getGamemode() {
        return gamemode;
    }

    public void setGamemode(String gamemode) {
        this.gamemode = gamemode;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public String getNuggetId() {
        return nuggetId;
    }

    public void setNuggetId(String nuggetId) {
        this.nuggetId = nuggetId;
    }

    public String getLesson() {
        return lesson;
    }

    public void setLesson(String lesson) {
        this.lesson = lesson;
    }
}

