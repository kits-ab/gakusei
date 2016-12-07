package se.kits.gakusei.content.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@Table(name = "facts", schema = "contentschema")
public class Fact implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String data;

    private String description;

    @ManyToOne
    @JoinColumn(name="nuggetid")
    private Nugget nugget;

    public Fact(){}

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Nugget getNugget() {
        return nugget;
    }

    public void setNugget(Nugget nugget) {
        this.nugget = nugget;
    }
}
