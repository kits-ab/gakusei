package se.kits.gakusei.content.model;

import se.sandboge.japanese.conjugation.Verb;

import javax.annotation.Generated;
import javax.persistence.*;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

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

        for(Method method : allMethods){
            if(Modifier.isPublic(method.getModifiers())
                    && !Modifier.isStatic(method.getModifiers())
                    && method.getGenericReturnType().equals(String.class)){
                inflectionMethods.add(method.getName());
            }
        }

        return inflectionMethods;
    }
}
