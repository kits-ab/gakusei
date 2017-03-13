package se.kits.gakusei.user.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import se.kits.gakusei.content.model.UserLesson;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements Serializable{

    private static final long serialVersionUID = 6433155328293181762L;

    @Id
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(name = "userrole")
    private String role;

    @JsonManagedReference
    @OneToMany(mappedBy="user", fetch=FetchType.EAGER)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Event> events;

    @JsonManagedReference
    @OneToMany(mappedBy = "user", fetch=FetchType.EAGER)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<ProgressTracking> progressTrackingList;

    @JsonManagedReference
    @OneToMany(mappedBy="user", fetch = FetchType.EAGER)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<UserLesson> usersLessons;

    public User() {
    }

    public User(String username, String password, String role) {
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

    public void setProgressTrackingList(List<ProgressTracking> progressTrackingList) {
        this.progressTrackingList = progressTrackingList;
    }

    public List<UserLesson> getUsersLessons() {
        return usersLessons;
    }

    public void setUsersLessons(List<UserLesson> usersLessons) {
        this.usersLessons = usersLessons;
    }
}
