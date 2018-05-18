package se.kits.gakusei.content.model;

import java.util.HashMap;

public class FavoriteLesson
    extends Lesson {

    public HashMap<String, Integer> getNuggetData() {
        return nuggetData;
    }

    public void setNuggetData(HashMap<String, Integer> nuggetData) {
        this.nuggetData = nuggetData;
    }

    private HashMap<String, Integer> nuggetData;

    public FavoriteLesson() {
        super();
    }

}

