package se.kits.gakusei.content.model;

import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;

import javax.persistence.*;

@Entity
@Table(name = "quiz", schema = "contentschema")
public class Quiz implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @ApiModelProperty(notes="the database generated quiz id")
    private long id;

    @Column(nullable = false, unique = true)
    @ApiModelProperty(notes="the quiz name")
    private String name;

    @ApiModelProperty(notes="the quiz description")
    private String description;

    public Quiz() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
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

}

