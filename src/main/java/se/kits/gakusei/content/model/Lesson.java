package se.kits.gakusei.content.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "lessons", schema = "contentschema")
@NamedNativeQueries({
        @NamedNativeQuery(
                name = "Lesson.findNuggetsByTwoFactTypes",
                query = "select * from contentschema.nuggets n " +
                        "where n.hidden = FALSE AND n.id in " +
                        "(select filtered.nugget_id from contentschema.facts " +
                        "inner join (select nugget_id from contentschema.lessons_nuggets where lesson_id = " +
                        "(select distinct id from contentschema.lessons where name = :lessonName)) as filtered " +
                        "on nuggetid = nugget_id " +
                        "where facts.type IN (:factType1, :factType2) " +
                        "GROUP BY filtered.nugget_id HAVING count(filtered.nugget_id) > 1)",
                resultClass = Nugget.class),
        @NamedNativeQuery(
                name = "Lesson.findKanjiLessNuggetsByFactType",
                query = "select * from contentschema.nuggets n " +
                        "where n.type  <> 'kanji' and n.id in " +
                        "(select filtered.nugget_id from contentschema.facts " +
                        "inner join (select nugget_id from contentschema.lessons_nuggets where lesson_id = " +
                        "(select distinct id from contentschema.lessons where name = :lessonName)) as filtered " +
                        "on nuggetid = nugget_id " +
                        "where facts.type IN (:factType1, :factType2) " +
                        "GROUP BY filtered.nugget_id HAVING count(filtered.nugget_id) > 1)",
                resultClass = Nugget.class),
        @NamedNativeQuery(
                name = "Lesson.findKanjiNuggetsByFactType",
                query = "select * from contentschema.nuggets n " +
                        "where n.type  = 'kanji' and n.id in " +
                        "(select filtered.nugget_id from contentschema.facts " +
                        "inner join (select nugget_id from contentschema.lessons_nuggets where lesson_id = " +
                        "(select distinct id from contentschema.lessons where name = :lessonName)) as filtered " +
                        "on nuggetid = nugget_id " +
                        "where facts.type IN (:factType1, :factType2) " +
                        "GROUP BY filtered.nugget_id HAVING count(filtered.nugget_id) > 1)",
                resultClass = Nugget.class),
        @NamedNativeQuery(
                name = "Lesson.findNuggetsBySuccessrate",
                query = "select * from contentschema.nuggets where id in " +
                        "(select nugget_id from progresstrackinglist " +
                        " where user_ref = :username " +
                        "    and incorrect_count > correct_count) " +
                        "    and :lessonName in " +
                        "    (select name from contentschema.lessons inner join contentschema.lessons_nuggets \n" +
                        "       on contentschema.lessons.id=contentschema.lessons_nuggets.lesson_id)",
                resultClass = Nugget.class),
        @NamedNativeQuery(
                name = "Lesson.findUnansweredNuggets",
                query = "select * from contentschema.nuggets where id not in " +
                        "(select nugget_id from progresstrackinglist where user_ref = :username)" +
                        "and id in " +
                        "(select ln.nugget_id from contentschema.lessons l, contentschema.lessons_nuggets ln" +
                        "   where l.id=ln.lesson_id and l.name =  :lessonName)",
                resultClass = Nugget.class),
        @NamedNativeQuery(
                name = "Lesson.findCorrectlyAnsweredNuggets",
                query = "select * from contentschema.nuggets where id in " +
                        "(select nugget_id from progresstrackinglist where user_ref = :username and correct_count > 0)" +
                        "and id in " +
                        "(select nugget_id from contentschema.lessons inner join contentschema.lessons_nuggets on " +
                        "contentschema.lessons.id=contentschema.lessons_nuggets.lesson_id where name = :lessonName)",
                resultClass = Nugget.class)
})
public class Lesson implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @ManyToMany
    @JsonManagedReference
    @JoinTable(
            name = "lessons_nuggets",
            schema = "contentschema",
            joinColumns = @JoinColumn(name = "lesson_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "nugget_id", referencedColumnName = "id"))
    private List<Nugget> nuggets;

    @JsonBackReference
    @OneToMany(mappedBy="lesson", fetch = FetchType.LAZY)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<UserLesson> userLessons;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name="course_id")
    private Course course;

    public Lesson() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Nugget> getNuggets() {
        return nuggets;
    }

    public void setNuggets(List<Nugget> nuggets) {
        this.nuggets = nuggets;
    }

    public List<UserLesson> getUserLessons() {
        return userLessons;
    }

    public void setUserLessons(List<UserLesson> userLessons) {
        this.userLessons = userLessons;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
}
