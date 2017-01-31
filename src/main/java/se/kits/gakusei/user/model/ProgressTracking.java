package se.kits.gakusei.user.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import se.kits.gakusei.content.model.Nugget;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "progresstrackinglist")
public class ProgressTracking implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "user_ref")
    private User user;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "nuggetid")
    private Nugget nugget;

    @Column(name = "correct_count")
    private long correctCount;

    @Column(name = "incorrect_count")
    private long incorrectCount;

    @Column(name = "latest_timestamp")
    private Timestamp latestTimestamp;

    @Column(name = "latest_result")
    private boolean latestResult;

    public ProgressTracking(){}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getCorrectCount() {
        return correctCount;
    }

    public void setCorrectCount(long correctCount) {
        this.correctCount = correctCount;
    }

    public long getIncorrectCount() {
        return incorrectCount;
    }

    public void setIncorrectCount(long incorrectCount) {
        this.incorrectCount = incorrectCount;
    }

    public Timestamp getLatestTimestamp() {
        return latestTimestamp;
    }

    public void setLatestTimestamp(Timestamp latestTimestamp) {
        this.latestTimestamp = latestTimestamp;
    }

    public boolean isLatestResult() {
        return latestResult;
    }

    public void setLatestResult(boolean latestResult) {
        this.latestResult = latestResult;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Nugget getNugget() {
        return nugget;
    }

    public void setNugget(Nugget nugget) {
        this.nugget = nugget;
    }
}
