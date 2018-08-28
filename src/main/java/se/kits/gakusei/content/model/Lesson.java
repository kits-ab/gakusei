package se.kits.gakusei.content.model;

import com.fasterxml.jackson.annotation.*;

import java.io.Serializable;
import java.util.List;

import javax.persistence.*;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id"
)
@NamedNativeQueries({
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
                query = "select * from contentschema.nuggets where hidden is false and id not in " +
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
                resultClass = Nugget.class),
        @NamedNativeQuery(
                name = "Lesson.findVerbNuggets",
                query = "select * from contentschema.nuggets n where n.hidden = FALSE and n.id in " +
                        "(select contentschema.nuggets.id " +
                        "from ((contentschema.nuggets " +
                        "INNER JOIN contentschema.lessons_nuggets ln on n.id = ln.nugget_id)" +
                        "INNER JOIN contentschema.word_types wt on n.word_type_ref = wt.id)" +
                        "WHERE wt.type = 'verb' AND ln.lesson_id = :lessonId) ",
                resultClass = Nugget.class),
        @NamedNativeQuery(
                name = "Lesson.findUnansweredRetentionNuggets",
                query = "SELECT contentschema.nuggets.* FROM contentschema.nuggets\n" +
                        "WHERE nuggets.id NOT IN\n" +
                        "(SELECT lessons_nuggets.nugget_id FROM contentschema.lessons_nuggets\n" +
                        "LEFT JOIN progresstrackinglist ON progresstrackinglist.nugget_id = lessons_nuggets.nugget_id\n" +
                        "WHERE (user_ref = :username) AND retention_date IS NOT NULL\n" +
                        "AND lesson_id IN (SELECT id FROM contentschema.lessons WHERE name = :lessonName))\n" +
                        "AND nuggets.id IN (SELECT nugget_id FROM contentschema.lessons_nuggets RIGHT JOIN contentschema.lessons ON lessons_nuggets.lesson_id = lessons.id WHERE name = :lessonName)",
                resultClass = Nugget.class),
        @NamedNativeQuery(
                name = "Lesson.findNuggetsByRetentionDate",
                query = "SELECT contentschema.nuggets.* FROM contentschema.nuggets\n" +
                        "WHERE nuggets.id IN (SELECT progresstrackinglist.nugget_id FROM progresstrackinglist \n" +
                        "\tINNER JOIN contentschema.lessons_nuggets ON progresstrackinglist.nugget_id = lessons_nuggets.nugget_id\n" +
                        "\tWHERE user_ref = :username AND progresstrackinglist.retention_date <= current_timestamp \n" +
                        "\tAND lesson_id IN (SELECT id FROM contentschema.lessons WHERE name = :lessonName) ORDER BY retention_date ASC)",
                resultClass = Nugget.class),
        @NamedNativeQuery(
                name = "Lesson.findKanjisByRetentionDate",
                query = "SELECT contentschema.kanjis.* FROM contentschema.kanjis\n" +
                "WHERE kanjis.id IN (SELECT progresstrackinglist.nugget_id FROM progresstrackinglist\n" +
                "INNER JOIN contentschema.lessons_kanjis ON progresstrackinglist.nugget_id = lessons_kanjis.kanji_id\n" +
                "WHERE user_ref = :username AND progresstrackinglist.retention_date <= current_timestamp\n" +
                "AND lesson_id IN (SELECT id FROM contentschema.lessons WHERE name = :lessonName) ORDER BY retention_date ASC)",
                resultClass = Kanji.class),
        @NamedNativeQuery(
                name = "Lesson.findUnansweredRetentionKanjis",
                query = "SELECT contentschema.kanjis.* FROM contentschema.kanjis\n" +
                "WHERE kanjis.id NOT IN\n" +
                "(SELECT lessons_kanjis.kanji_id FROM contentschema.lessons_kanjis\n" +
                "LEFT JOIN progresstrackinglist ON progresstrackinglist.nugget_id = lessons_kanjis.kanji_id\n" +
                "WHERE (user_ref = :username) AND retention_date IS NOT NULL\n" +
                "AND lesson_id IN (SELECT id FROM contentschema.lessons WHERE name = :lessonName))\n" +
                "AND kanjis.id IN (SELECT kanji_id FROM contentschema.lessons_kanjis RIGHT JOIN contentschema.lessons ON lessons_kanjis.lesson_id = lessons.id WHERE name = :lessonName)",

                resultClass = Kanji.class)
})
@Table(name = "lessons", schema = "contentschema")
public class Lesson implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    //@JsonManagedReference(value = "lessonnugget")
    @JoinTable(
        name = "lessons_nuggets",
        schema = "contentschema",
        joinColumns = @JoinColumn(
            name = "lesson_id",
            referencedColumnName = "id"
        )
        ,
        inverseJoinColumns = @JoinColumn(
            name = "nugget_id",
            referencedColumnName = "id"
        )

    )
    @ManyToMany
    private List<Nugget> nuggets;

    @JoinTable(
        name = "lessons_kanjis",
        schema = "contentschema",
        joinColumns = @JoinColumn(
            name = "lesson_id",
            referencedColumnName = "id"
        )
        ,
        inverseJoinColumns = @JoinColumn(
            name = "kanji_id",
            referencedColumnName = "id"
        )
        ,
        uniqueConstraints = @UniqueConstraint(
            columnNames = { "lesson_id", "kanji_id"
            }
        )

    )
    @ManyToMany(fetch = FetchType.EAGER)
    private List<Kanji> kanjis;

    @Fetch(value = FetchMode.SUBSELECT)
    @JsonIgnore
    @OneToMany(mappedBy = "lesson", fetch = FetchType.LAZY)
    private List<UserLesson> userLessons;

    @JoinColumn(name = "course_ref")
    @JsonBackReference(value = "courselesson")
    @ManyToOne
    private Course course;

    public Lesson() {}

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

    public List<Kanji> getKanjis() {
        return kanjis;
    }

    public void setKanjis(List<Kanji> kanjis) {
        this.kanjis = kanjis;
    }

    public void clearNuggets() {
        this.nuggets = null;
    }

    public void clearKanjis() {this.kanjis = null; }

}

