package se.kits.gakusei.content.model;

import java.io.Serializable;

import javax.persistence.*;

public class Announcement implements Serializable {
    private String text;

    public Announcement() {}

    public Announcement(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }
}
