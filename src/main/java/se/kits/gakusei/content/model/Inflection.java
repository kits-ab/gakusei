package se.kits.gakusei.content.model;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Generated;
import javax.persistence.*;

import se.sandboge.japanese.conjugation.Verb;

@Entity
@Table(name = "inflections", schema = "contentschema")
public class Inflection {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    @JoinColumn(name = "lesson_ref")
    @ManyToOne
    private Lesson lesson;

    private String inflectionMethod;

    public Inflection() {}

    public Long getId() {
        return id;
    }

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

    public static List<String> getAllInflectionMethods() {
        List<String> inflectionMethods = new ArrayList<>();
        Method[] allMethods = Verb.class.getDeclaredMethods();
        for (Method method : allMethods) {
            if (isInflection(method)) {
                inflectionMethods.add(method.getName());
            }
        }
        return inflectionMethods;
    }

    private static boolean isInflection(Method method) {
        return Modifier.isPublic(method.getModifiers()) && !Modifier.isStatic(
            method.getModifiers()
        ) && method.getGenericReturnType().equals(String.class);
    }

}

