package se.kits.gakusei.content.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import io.swagger.annotations.ApiModelProperty;

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
    @ApiModelProperty(notes="the kanji id")
    private String id = UUID.randomUUID().toString();

    @ApiModelProperty(notes="the kanji description")
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

    @ApiModelProperty(notes="the swedish word for the kanji")
    private String swedish;

    @ApiModelProperty(notes="the english word for the kanji")
    private String english;

    private String kanji;

    private String reading;

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

    public String getReading() { return reading; }

    public void setReading(String reading) { this.reading = reading; }

}

