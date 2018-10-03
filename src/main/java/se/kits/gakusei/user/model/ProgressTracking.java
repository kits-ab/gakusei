package se.kits.gakusei.user.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.*;

@Entity
@Table(name = "progresstrackinglist")
public class ProgressTracking implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @ApiModelProperty(notes="the database generated progress tracking id")
    private long id;

    @JoinColumn(name = "user_ref")
    @JsonBackReference(value = "progress")
    @ManyToOne
    private User user;

    @JoinColumn(name = "nugget_type_ref")
    @ManyToOne
    private NuggetType nuggetType;

    @Column(name = "nugget_id")
    @ApiModelProperty(notes="the nugget id")
    private String nuggetID;

    @Column(name = "correct_count")
    @ApiModelProperty(notes="the correct count")
    private long correctCount;

    @Column(name = "incorrect_count")
    @ApiModelProperty(notes="the incorrect count")
    private long incorrectCount;

    @Column(name = "latest_timestamp")
    @ApiModelProperty(notes="the latest timestamp")
    private Timestamp latestTimestamp;

    @Column(name = "latest_result")
    @ApiModelProperty(notes="the latest result from the users")
    private boolean latestResult;

    @Column(name = "retention_factor")
    @ApiModelProperty(notes="the retention factor")
    private double retentionFactor;

    @ApiModelProperty(notes="the retention interval")
    @Column(name = "retention_interval")
    private double retentionInterval;

    @ApiModelProperty(notes="the retention date")
    @Column(name = "retention_date")
    private Timestamp retentionDate;


    public ProgressTracking() {}

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

    public NuggetType getNuggetType() {
        return nuggetType;
    }

    public void setNuggetType(NuggetType nuggetType) {
        this.nuggetType = nuggetType;
    }
}

