package se.kits.gakusei.init;

import se.kits.gakusei.content.model.Fact;
import se.kits.gakusei.content.model.Nugget;

import java.util.ArrayList;
import java.util.List;

public class TestDataHolder {

    private String english;
    private String katakana;
    private String kunyomi;
    private String kanji;
    private String type;

    public TestDataHolder() {
    }

    public String getEnglish() {
        return english;
    }

    public void setEnglish(String english) {
        this.english = parseIfStringIsNullValue(english);
    }

    public String getKatakana() {
        return katakana;
    }

    public void setKatakana(String katakana) {
        this.katakana = parseIfStringIsNullValue(katakana);
    }

    public String getKunyomi() {
        return kunyomi;
    }

    public void setKunyomi(String kunyomi) {
        this.kunyomi = parseIfStringIsNullValue(kunyomi);
    }

    public String getKanji() {
        return kanji;
    }

    public void setKanji(String kanji) {
        this.kanji = parseIfStringIsNullValue(kanji);
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = parseIfStringIsNullValue(type);
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
        if (this.english == null && this.katakana == null && this.kunyomi == null && this.kanji == null) {
            return null;
        }
        List<Fact> facts = new ArrayList<>();
        if (this.english != null) {
            Fact fact = new Fact();
            fact.setType("english_translation");
            fact.setData(this.english);
            facts.add(fact);
        }
        if (this.katakana != null) {
            Fact fact = new Fact();
            fact.setType("writing");
            fact.setData(this.katakana);
            facts.add(fact);
        }
        if (this.kunyomi != null) {
            Fact fact = new Fact();
            fact.setType("reading");
            fact.setData(this.kunyomi);
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

    private String parseIfStringIsNullValue(String typeString) {
        if (typeString.equalsIgnoreCase("null") || typeString == null) {
            return null;
        } else {
            return typeString;
        }
    }

    @Override
    public String toString() {
        return "TestDataHolder{" +
                "english='" + english + '\'' +
                ", katakana='" + katakana + '\'' +
                ", kunyomi='" + kunyomi + '\'' +
                ", kanji='" + kanji + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}
