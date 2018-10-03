package se.kits.gakusei.content.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.sql.Timestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModelProperty;
import se.kits.gakusei.user.model.User;

@Entity
@Table(
    name = "user_lesson",
    uniqueConstraints = @UniqueConstraint(
        columnNames = { "lesson_ref", "user_ref"
        }
    )

)
public class UserLesson {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @ApiModelProperty(notes="the database generated user lesson id")
    private Long id;

    @JoinColumn(name = "user_ref")
    @JsonBackReference(value = "userlesson")
    @ManyToOne
    private User user;

    //@JsonManagedReference(value = "ullessons")
    @JoinColumn(name = "lesson_ref")
    @ManyToOne
    @NotNull
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

