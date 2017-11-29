package se.kits.gakusei.content.model;

import com.fasterxml.jackson.annotation.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name="nuggets", schema = "contentschema")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Nugget implements Serializable{

    @Id
    private String id;

    //Remove when migrating, along with getter and setter
    @Column(nullable = false)
    private String type;

    private String description;

    private boolean hidden = false;

    //Remove when migrating, along with getter and setter
    @OneToMany(mappedBy="nugget", fetch=FetchType.EAGER)
    @JsonManagedReference(value = "fact")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Fact> facts;

    @ManyToOne
    @JsonBackReference(value = "book")
    @JoinColumn(name = "book_ref")
    private Book title;

    @ManyToOne
    @JsonBackReference(value = "wordtype")
    @JoinColumn(name = "word_type_ref")
    private WordType wordType;

    @ManyToMany(mappedBy = "nuggets")
    @JsonIgnore
    private List<Lesson> lessons;

    private String swedish;

    private String english;

    private String jpRead;

    private String jpWrite;

    public Nugget(){}

    public Nugget(String type){
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    public List<Fact> getFacts() {
        return facts;
    }

    public void setFacts(List<Fact> facts) {
        this.facts = facts;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<Lesson> getLessons() {
        return lessons;
    }

    public void setLessons(List<Lesson> lessons) {
        this.lessons = lessons;
    }

    public String getSwedish() {
        return swedish;
    }

    public void setSwedish(String swedish) {
        this.swedish = swedish;
    }

    public String getEnglish() {
        return english;
    }

    public void setEnglish(String english) {
        this.english = english;
    }

    public String getJpRead() {
        return jpRead;
    }

    public void setJpRead(String jpRead) {
        this.jpRead = jpRead;
    }

    public String getJpWrite() {
        return jpWrite;
    }

    public void setJpWrite(String jpWrite) {
        this.jpWrite = jpWrite;
    }

    public WordType getWordType() {
        return wordType;
    }

    public void setWordType(WordType wordType) {
        this.wordType = wordType;
    }

    public Book getTitle() {
        return title;
    }

    public void setTitle(Book title) {
        this.title = title;
    }
}
