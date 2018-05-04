package se.kits.gakusei.content.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import se.kits.gakusei.user.model.User;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;


@Entity
@Table(name = "kanji_drawings")
public class KanjiDrawing implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, name = "timestamp")
    private Timestamp timestamp;

    @Column(nullable = false, name = "image_data")
    private String imageData;

    @JsonBackReference(value = "kanji_drawings")
    @ManyToOne
    @JoinColumn(name = "user_ref")
    private User user;

    @Column(nullable = false, name = "nugget_id")
    private String nuggetID;

    @Column(nullable = false, name = "difficulty")
    private String difficulty;

    public KanjiDrawing() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public String getImageData() {
        return imageData;
    }

    public void setImageData(String imageData) {
        this.imageData = imageData;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getNuggetID() {
        return nuggetID;
    }

    public void setNuggetID(String nuggetID) {
        this.nuggetID = nuggetID;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
}
