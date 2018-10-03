package se.kits.gakusei.content.model;

import com.fasterxml.jackson.annotation.*;
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
@Table(name = "nuggets", schema = "contentschema")
public class Nugget implements Serializable {
    @Id
    @ApiModelProperty(notes="the nugget id")
    private String id = UUID.randomUUID().toString();

    @ApiModelProperty(notes="the nugget description")
    private String description;

    private boolean hidden = false;

    @JoinTable(
        name = "nugget_books",
        schema = "contentschema",
        joinColumns = @JoinColumn(
            name = "nugget_id",
            referencedColumnName = "id"
        )
        ,
        inverseJoinColumns = @JoinColumn(
            name = "book_id",
            referencedColumnName = "id"
        )
        ,
        uniqueConstraints = @UniqueConstraint(
            columnNames = { "nugget_id", "book_id"
            }
        )

    )
    @ManyToMany(fetch = FetchType.EAGER)
    private List<Book> books;

    @JoinColumn(name = "word_type_ref")
    @ManyToOne
    private WordType wordType;

    @JsonIgnore
    @ManyToMany(mappedBy = "nuggets")
    private List<Lesson> lessons;

    private String swedish;

    private String english;

    private String jpRead;

    private String jpWrite;

    public Nugget() {}

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

    public String getId() {
        return id;
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

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }

    @Override
    public boolean equals(Object object) {
        if (object == null || !(object instanceof Nugget)) {
            return false;
        } else if (object == this) {
            return true;
        } else {
            Nugget nugget = (Nugget) object;
            return nugget.getWordType().getType().equals(
                wordType.getType()
            ) && nugget.getDescription().equals(
                description
            ) && nugget.getSwedish().equals(swedish) && nugget.getEnglish(

            ).equals(english) && nugget.getJpRead().equals(
                jpRead
            ) && nugget.getJpWrite().equals(jpWrite);
        }
    }

}

