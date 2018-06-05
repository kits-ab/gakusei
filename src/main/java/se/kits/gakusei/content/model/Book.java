package se.kits.gakusei.content.model;

import java.io.Serializable;

import javax.persistence.*;

@Entity
@Table(name = "books", schema = "contentschema")
public class Book implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    @Column(nullable = false, unique = true)
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

