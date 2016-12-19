package se.kits.gakusei.init;

import se.kits.gakusei.content.model.Fact;
import se.kits.gakusei.content.model.Nugget;

import java.util.ArrayList;
import java.util.List;

public class TestDataHolder {

    private String english;
    private String writing;
    private String reading;
    private String kanji;
    private String type;

    public TestDataHolder() {
    }

    public String getEnglish() {
        return english;
    }

    public void setEnglish(String english) {
        this.english = english;
    }

    public String getWriting() {
        return writing;
    }

    public void setWriting(String writing) {
        this.writing = writing;
    }

    public String getReading() {
        return reading;
    }

    public void setReading(String reading) {
        this.reading = reading;
    }

    public String getKanji() {
        return kanji;
    }

    public void setKanji(String kanji) {
        this.kanji = kanji;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Nugget createNugget() {
        if (this.type == null) {
            return null;
        }
        Nugget nugget = new Nugget();
        nugget.setType(this.type);
        if(this.english != null) {
            nugget.setDescription(this.english);
        }
        return nugget;
    }

    public List<Fact> createFacts() {
        if (this.english == null && this.writing == null && this.reading == null && this.kanji == null) {
            return null;
        }
        List<Fact> facts = new ArrayList<>();
        if (this.english != null) {
            Fact fact = new Fact();
            fact.setType("english_translation");
            fact.setData(this.english);
            facts.add(fact);
        }
        if (this.writing != null) {
            Fact fact = new Fact();
            fact.setType("writing");
            fact.setData(this.writing);
            facts.add(fact);
        }
        if (this.reading != null) {
            Fact fact = new Fact();
            fact.setType("reading");
            fact.setData(this.reading);
            facts.add(fact);
        }
        if (this.kanji != null) {
            Fact fact = new Fact();
            fact.setType("kanji");
            fact.setData(this.kanji);
            facts.add(fact);
        }
        return facts;
    }

    @Override
    public String toString() {
        return "TestDataHolder{" +
                "english='" + english + '\'' +
                ", writing='" + writing + '\'' +
                ", reading='" + reading + '\'' +
                ", kanji='" + kanji + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}
