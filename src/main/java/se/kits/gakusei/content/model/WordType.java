package se.kits.gakusei.content.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name="word_types", schema = "contentschema")
public class WordType implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String type;

    public WordType() {
    }

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
