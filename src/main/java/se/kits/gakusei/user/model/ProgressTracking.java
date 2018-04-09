package se.kits.gakusei.user.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
    @JsonBackReference(value = "progress")
    @JoinColumn(name = "user_ref")
    private User user;

    @Column(name = "nugget_id")
    private String nuggetID;

    @Column(name = "correct_count")
    private long correctCount;

    @Column(name = "incorrect_count")
    private long incorrectCount;

    @Column(name = "latest_timestamp")
    private Timestamp latestTimestamp;

    @Column(name = "latest_result")
    private boolean latestResult;

    @Column(name = "retention_factor")
    private double retentionFactor;

    @Column(name = "retention_interval")
    private double retentionInterval;

    @Column(name = "retention_date")
    private Timestamp retentionDate;

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

    public String getNuggetID() {
        return nuggetID;
    }

    public void setNuggetID(String nuggetID) {
        this.nuggetID = nuggetID;
    }

    public double getRetentionFactor() {
        return retentionFactor;
    }

    public void setRetentionFactor(double retention_factor) {
        this.retentionFactor = retention_factor;
    }

    public double getRetentionInterval() {
        return retentionInterval;
    }

    public void setRetentionInterval(double retentionInterval) {
        this.retentionInterval = retentionInterval;
    }

    public Timestamp getRetentionDate() {
        return retentionDate;
    }

    public void setRetentionDate(Timestamp retention_date) {
        this.retentionDate = retention_date;
    }


}
