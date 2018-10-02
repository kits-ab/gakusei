package se.kits.gakusei.user.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "nugget_category", schema = "public")
public class NuggetType implements Serializable {

    @Id
    @Column(nullable = false, unique = true)
    private Long id;

    @Column(nullable = false, unique = true)
    private String type;

    public NuggetType() {}

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

