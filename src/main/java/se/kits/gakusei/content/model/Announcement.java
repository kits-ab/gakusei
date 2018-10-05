package se.kits.gakusei.content.model;

import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;
import java.sql.Timestamp;


import javax.persistence.*;

@Entity
@Table(name = "announcements", schema = "public")
public class Announcement implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @ApiModelProperty(notes="the database generated announcement id")
    private Long id;

    @Column(nullable = false)
    @ApiModelProperty(notes="the start date of the announcement")
    private Timestamp startDate;

    @Column(nullable = false)
    @ApiModelProperty(notes="the end date of the announcement")
    private Timestamp endDate;

    @Column
    private String text;

    public Announcement() {}

    public Long getId() {
        return id;
    }

    public Timestamp getStartDate() {
        return startDate;
    }

    public Timestamp getEndDate() {
        return endDate;
    }

    public String getText() {
        return text;
    }

    public void setStartDate(Timestamp startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(Timestamp endDate) {
        this.endDate = endDate;
    }

    public void setText(String text) {
        this.text = text;
    }
}
