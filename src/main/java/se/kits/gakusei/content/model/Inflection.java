package se.kits.gakusei.content.model;

import javax.annotation.Generated;
import javax.persistence.*;

@Entity
@Table(name = "inflections", schema = "contentschema")
public class Inflection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lesson_ref")
    private Lesson lesson;

    private String inflectionMethod;

    public Inflection() { }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setInflectionMethod(String inflectionMethod) {
        this.inflectionMethod = inflectionMethod;
    }

    public String getInflectionMethod() {
        return inflectionMethod;
    }
}
