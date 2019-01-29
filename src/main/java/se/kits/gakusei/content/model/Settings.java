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

    @Column(nullable = false)
    private String flag_svg;

    @Column
    private boolean enabled;

    public Long getId() {
        return id;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getFlag_svg() {
        return flag_svg;
    }

    public void setFlag_svg(String flag_svg) {
        this.flag_svg = flag_svg;
    }

    public String getLanguage_code() {
        return language_code;
    }

    public void setLanguage_code(String language_code) {
        this.language_code = language_code;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
