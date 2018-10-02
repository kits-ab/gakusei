package se.kits.gakusei.dto;

public class EventDTO {
    private long timestamp;
    private String gamemode;
    private String type;
    private String data;
    private String nuggetid;
    private String nuggetcategory;
    private String username;

    private String lesson;

    public EventDTO() {}

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getGamemode() {
        return gamemode;
    }

    public void setGamemode(String gamemode) {
        this.gamemode = gamemode;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNuggetid() {
        return nuggetid;
    }

    public void setNuggetid(String nuggetid) {
        this.nuggetid = nuggetid;
    }

    public String getLesson() {
        return lesson;
    }

    public void setLesson(String lesson) {
        this.lesson = lesson;
    }

    public String getNuggetcategory() {
        return nuggetcategory;
    }

    public void setNuggetcategory(String nuggetcategory) {
        this.nuggetcategory = nuggetcategory;
    }

    public int getNuggetcategoryAsInt(){
            switch (getNuggetcategory()){
                case "guess" : return 2;//Database "vocab"
                case "kanji" : return 3;
                case "quiz"  : return 4;
                case "flashcards" : return 5;
                case "grammar" : return 6;
                case "translate" : return 7;
                default:return 1;
            }

    }

}

