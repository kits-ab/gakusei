package se.kits.gakusei.content.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name="nuggets", schema = "contentschema")
public class Nugget implements Serializable{

    @Id
    private String id;

    @Column(nullable = false)
    private String type;

    private String description;

    private boolean hidden = false;

    @OneToMany(mappedBy="nugget", fetch=FetchType.EAGER)
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Fact> facts;

    @ManyToMany(mappedBy = "nuggets")
    @JsonBackReference
    private List<Lesson> lessons;

//    @OneToMany(mappedBy = "nugget", fetch=FetchType.EAGER)
//    @JsonManagedReference
//    @Fetch(value = FetchMode.SUBSELECT)
//    private List<ProgressTracking> progressTrackingList;

    public Nugget(){}

    public Nugget(String type){
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    public List<Fact> getFacts() {
        return facts;
    }

    public void setFacts(List<Fact> facts) {
        this.facts = facts;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<Lesson> getLessons() {
        return lessons;
    }

    public void setLessons(List<Lesson> lessons) {
        this.lessons = lessons;
    }


//    public List<ProgressTracking> getProgressTrackingList() {
//        return progressTrackingList;
//    }
//
//    public void setProgressTrackingList(List<ProgressTracking> progressTrackingList) {
//        this.progressTrackingList = progressTrackingList;
//    }
}
