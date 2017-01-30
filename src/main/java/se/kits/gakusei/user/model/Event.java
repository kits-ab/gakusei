package se.kits.gakusei.user.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "events")
@NamedNativeQueries({
        @NamedNativeQuery(
                name = "Event.getUserSuccessRate",
                query = "select round((count(case data when 'true' then 1 else null end) * 100.0) / count(*)) " +
                        "from events " +
                        "where user_ref = :username and type = 'answeredCorrectly'"
        ),
        @NamedNativeQuery(
                name = "Event.getLatestNuggetForUser",
                query = "SELECT data" +
                        "FROM public.events" +
                        "where user_ref = :username and type = 'question'" +
                        "ORDER BY timestamp" +
                        "DESC" +
                        "limit 1"
        )
})

public class Event implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name="user_ref")
    private User user;

    public Event(){}

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
}
