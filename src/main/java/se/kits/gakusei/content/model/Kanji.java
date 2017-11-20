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

    @ManyToOne
    @JsonBackReference(value = "kanji_book")
    @JoinColumn(name = "book_ref")
    private Book title;

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

    public Book getTitle() {
        return title;
    }

    public void setTitle(Book title) {
        this.title = title;
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
