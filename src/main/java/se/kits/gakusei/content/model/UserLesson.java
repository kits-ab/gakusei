package se.kits.gakusei.content.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import se.kits.gakusei.user.model.User;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;

@Entity
@Table(name = "user_lesson", uniqueConstraints = @UniqueConstraint(columnNames = {"lesson_ref", "user_ref"}))
public class UserLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference(value = "userlesson")
    @JoinColumn(name = "user_ref")
    private User user;

    @NotNull
    @ManyToOne
    //@JsonManagedReference(value = "ullessons")
    @JoinColumn(name = "lesson_ref")
    private Lesson lesson;

    @Column
    private Timestamp firstDeadline;

    @Column
    private Timestamp secondDeadline;

    public UserLesson() {}

    public UserLesson(User user, Lesson lesson) {
        this.user = user;
        this.lesson = lesson;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public Timestamp getFirstDeadline() {
        return firstDeadline;
    }

    public void setFirstDeadline(Timestamp firstDeadline) {
        this.firstDeadline = firstDeadline;
    }

    public Timestamp getSecondDeadline() {
        return secondDeadline;
    }

    public void setSecondDeadline(Timestamp secondDeadline) {
        this.secondDeadline = secondDeadline;
    }
}
