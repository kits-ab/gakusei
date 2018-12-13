package se.kits.gakusei.content.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "settings", schema = "public")
public class Settings implements Serializable {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    @Column(nullable = false)
    private String language;

    @Column(nullable = false)
    private String language_code;

    public Long getId() {
        return id;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getLanguage_code() {
        return language_code;
    }

    public void setLanguage_code(String language_code) {
        this.language_code = language_code;
    }
}
