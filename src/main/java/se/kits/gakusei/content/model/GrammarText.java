package se.kits.gakusei.content.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(schema = "contentschema", name = "grammar_texts")
public class GrammarText {

    @Id
    private String id;

    private String book;

    private String course;

    private String type;

    private String jpShort;

    private String seShort;

    private String related;

    private String sample;

    private String seLong;

    public String getRelated() {
        return related;
    }

    public void setRelated(String related) {
        this.related = related;
    }

    public String getSample() {
        return sample;
    }

    public void setSample(String sample) {
        this.sample = sample;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSeLong() {
        return seLong;
    }

    public void setSeLong(String seLong) {
        this.seLong = seLong;
    }

    public String getSeShort() {
        return seShort;
    }

    public void setSeShort(String seShort) {
        this.seShort = seShort;
    }

    public String getJpShort() {
        return jpShort;
    }

    public void setJpShort(String jpShort) {
        this.jpShort = jpShort;
    }

    public String getBook() {
        return book;
    }

    public void setBook(String book) {
        this.book = book;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }
}
