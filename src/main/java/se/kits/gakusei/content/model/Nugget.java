package se.kits.gakusei.content.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name="nuggets", schema = "contentschema")
public class Nugget implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

//    @Column(name = "nuggetid")
//    private String nuggetid;

    private String type;
    private String description;

    @OneToMany(mappedBy="nugget", fetch=FetchType.EAGER)
    @JsonIgnore
    private List<Fact> facts;

    public Nugget(){}

//    public Nugget(String description, String type){
//        this.description = description;
//        this.type = type;
//
//    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Fact> getFacts() {
        return facts;
    }

    public void setFacts(List<Fact> facts) {
        this.facts = facts;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

//    public String getNuggetid() {
//        return nuggetid;
//    }
//
//    public void setNuggetid(String nuggetid) {
//        this.nuggetid = nuggetid;
//    }
}
