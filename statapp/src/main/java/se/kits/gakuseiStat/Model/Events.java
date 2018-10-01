package se.kits.gakuseiStat.Model;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
public class Events {
    private int id;
    private Timestamp timestamp;
    private String type;
    private String data;
    private String gamemode;
    private String nuggetId;
    private String lesson;

    @Id
    @Column(name = "id")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "timestamp")
    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    @Basic
    @Column(name = "type")
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Basic
    @Column(name = "data")
    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    @Basic
    @Column(name = "gamemode")
    public String getGamemode() {
        return gamemode;
    }

    public void setGamemode(String gamemode) {
        this.gamemode = gamemode;
    }

    @Basic
    @Column(name = "nugget_id")
    public String getNuggetId() {
        return nuggetId;
    }

    public void setNuggetId(String nuggetId) {
        this.nuggetId = nuggetId;
    }

    @Basic
    @Column(name = "lesson")
    public String getLesson() {
        return lesson;
    }

    public void setLesson(String lesson) {
        this.lesson = lesson;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Events events = (Events) o;
        return id == events.id &&
                Objects.equals(timestamp, events.timestamp) &&
                Objects.equals(type, events.type) &&
                Objects.equals(data, events.data) &&
                Objects.equals(gamemode, events.gamemode) &&
                Objects.equals(nuggetId, events.nuggetId) &&
                Objects.equals(lesson, events.lesson);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, timestamp, type, data, gamemode, nuggetId, lesson);
    }
}
