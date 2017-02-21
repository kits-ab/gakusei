package se.kits.gakusei.content.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;

@Entity
@Table(name = "user_lesson")
public class UserLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    @NotNull
    private String username;

    @Column
    @NotNull
    private String lessonName;

    @Column
    private Timestamp firstDeadline;

    @Column
    private Timestamp secondDeadline;

    public UserLesson() {}

    public UserLesson(String username, String lessonName) {
        this.username = username;
        this.lessonName = lessonName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getLessonName() {
        return lessonName;
    }

    public void setLessonName(String lessonName) {
        this.lessonName = lessonName;
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
