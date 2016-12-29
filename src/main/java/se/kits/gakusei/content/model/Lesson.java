package se.kits.gakusei.content.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "lessons", schema = "contentschema")
public class Lesson implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @ManyToMany
    @JsonManagedReference
    @JoinTable(
            name = "lessons_nuggets",
            joinColumns = @JoinColumn(name = "lesson_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "nugget_id", referencedColumnName = "id"))
    private List<Nugget> nuggets;

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
}
