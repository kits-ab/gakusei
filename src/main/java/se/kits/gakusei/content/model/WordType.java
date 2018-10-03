package se.kits.gakusei.content.model;

import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;

import javax.persistence.*;

@Entity
@Table(name = "word_types", schema = "contentschema")
public class WordType implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @ApiModelProperty(notes="the database generated word type id")
    private Long id;

    @ApiModelProperty(notes="the type")
    @Column(nullable = false, unique = true)
    private String type;

    public WordType() {}

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

}

