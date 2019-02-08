package se.kits.gakusei.user.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import se.kits.gakusei.content.model.UserLesson;

@Entity
@Table(name = "users")
public class User implements Serializable {
    private static final long serialVersionUID = 6433155328293181762L;

    @Id
    @JsonProperty(value = "username")
    @ApiModelProperty(notes="the user id")
    @Size(min= 2, max = 32, message = "username must be 2-32 characters")
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY, value = "password")
    @ApiModelProperty(notes="the user password")
    private String password;

    @Column(name = "userrole")
    @JsonProperty(value = "role")
    @ApiModelProperty(notes="the user role")
    private String role;

    @Fetch(value = FetchMode.SUBSELECT)
    @JsonManagedReference(value = "events")
    @JsonProperty(value = "events")
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Event> events;

    @Fetch(value = FetchMode.SUBSELECT)
    @JsonManagedReference(value = "events")
    @JsonProperty(value = "kanji_drawings")
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Event> kanjiDrawings;

    @Fetch(value = FetchMode.SUBSELECT)
    @JsonManagedReference(value = "progress")
    @JsonProperty(value = "progressTrackingList")
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<ProgressTracking> progressTrackingList;

    @Fetch(value = FetchMode.SUBSELECT)
    @JsonManagedReference(value = "userlesson")
    @JsonProperty(value = "usersLessons")
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<UserLesson> usersLessons;

    @Column
    private boolean newUser;

    @Column
    private String siteLanguage;

    public User() {}

    public User( String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }

    public List<ProgressTracking> getProgressTrackingList() {
        return progressTrackingList;
    }

    public void setProgressTrackingList(
        List<ProgressTracking> progressTrackingList
    ) {
        this.progressTrackingList = progressTrackingList;
    }

    public List<UserLesson> getUsersLessons() {
        return usersLessons;
    }

    public void setUsersLessons(List<UserLesson> usersLessons) {
        this.usersLessons = usersLessons;
    }

    public List<Event> getKanjiDrawings() {
        return kanjiDrawings;
    }

    public void setKanjiDrawings(List<Event> kanjiDrawings) {
        this.kanjiDrawings = kanjiDrawings;
    }

    public boolean isNewUser() {
        return newUser;
    }

    public void setNewUser(boolean newUser) {
        this.newUser = newUser;
    }

    public String getSiteLanguage() {
        return siteLanguage;
    }

    public void setSiteLanguage(String siteLanguage) {
        this.siteLanguage = siteLanguage;
    }
}

