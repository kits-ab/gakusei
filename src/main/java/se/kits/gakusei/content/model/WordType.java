package se.kits.gakusei.content.model;

import java.io.Serializable;

import javax.persistence.*;

@Entity
@Table(name = "word_types", schema = "contentschema")
public class WordType implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

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

