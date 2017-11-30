package se.kits.gakusei.content.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "kanjis", schema = "contentschema")
public class Kanji {

    @Id
    private String id = UUID.randomUUID().toString();

    private String description;

    private boolean hidden = false;

    @ManyToMany
    @JoinTable(
            name = "kanji_books",
            schema = "contentschema",
            joinColumns = @JoinColumn(name = "kanji_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "book_id", referencedColumnName = "id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"kanji_id", "book_id"})
    )
    private List<Book> books;

    private String swedish;

    private String english;

    private String kanji;

    @ManyToMany(mappedBy = "kanjis")
    @JsonIgnore
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
