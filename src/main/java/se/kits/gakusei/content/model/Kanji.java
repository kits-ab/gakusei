package se.kits.gakusei.content.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

import javax.persistence.*;

@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
@Table(name = "kanjis", schema = "contentschema")
public class Kanji implements Serializable {
    @Id
    private String id = UUID.randomUUID().toString();

    private String description;

    private boolean hidden = false;

    @JoinTable(
        name = "kanji_books",
        schema = "contentschema",
        joinColumns = @JoinColumn(
            name = "kanji_id",
            referencedColumnName = "id"
        )
        ,
        inverseJoinColumns = @JoinColumn(
            name = "book_id",
            referencedColumnName = "id"
        )
        ,
        uniqueConstraints = @UniqueConstraint(
            columnNames = { "kanji_id", "book_id"
            }
        )

    )
    @ManyToMany(fetch = FetchType.EAGER)
    private List<Book> books;

    private String swedish;

    private String english;

    private String kanji;

    @JsonIgnore
    @ManyToMany(mappedBy = "kanjis")
    private List<Lesson> lessons;

    public String getId() {
        return id;
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

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
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

    public String getKanji() {
        return kanji;
    }

    public void setKanji(String kanji) {
        this.kanji = kanji;
    }

    public List<Lesson> getLessons() {
        return lessons;
    }

    public void setLessons(List<Lesson> lessons) {
        this.lessons = lessons;
    }

}

