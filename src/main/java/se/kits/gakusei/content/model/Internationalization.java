package se.kits.gakusei.content.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class Internationalization implements Serializable {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    @Column(nullable = false)
    private String abbreviation;

    @Column(nullable = false)
    private String language;

    @Column(nullable = false)
    private String sentence;

    public Long getId() {
        return id;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public void setAbbrievation(String abbreviation) {
        this.abbreviation = abbreviation;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getSentence() {
        return sentence;
    }

    public void setSentence(String sentence) {
        this.sentence = sentence;
    }
}
