package se.kits.gakusei.content.model;

import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;

import javax.persistence.*;

@Entity
@Table(name = "books", schema = "contentschema")
public class Book implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @ApiModelProperty(notes="the database generated book id")
    private Long id;

    @Column(nullable = false, unique = true)
    @ApiModelProperty(notes="the book title")
    private String title;

    public Book() {}

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

}

