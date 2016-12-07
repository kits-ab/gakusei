package se.kits.gakusei.content.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@Table(name = "facts", schema = "contentschema")
public class Fact implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String type;
    private String data;
    private String description;

    @ManyToOne
    @JoinColumn(name="nuggetid")
//    @NotNull
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

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Nugget getNugget() {
        return nugget;
    }

    public void setNugget(Nugget nugget) {
        this.nugget = nugget;
    }
}
