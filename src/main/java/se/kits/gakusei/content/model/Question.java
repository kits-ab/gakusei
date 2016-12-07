package se.kits.gakusei.content.model;

import java.util.ArrayList;

public class Question {

    private Nugget nugget;
    private ArrayList<Fact> alternatives = new ArrayList<>();

    public Question(){}


    public Nugget getNugget() {
        return nugget;
    }

    public void setNugget(Nugget nugget) {
        this.nugget = nugget;
    }


    public ArrayList<Fact> getAlternatives() {
        return alternatives;
    }

    public void setAlternatives(ArrayList<Fact> alternatives) {
        this.alternatives = alternatives;
    }
}
