package se.kits.gakusei.dto;

public class KanjiDrawingDTO {
    private long timestamp;
    private String data;
    private String nuggetid;
    private String username;
    private String difficulty;

    public KanjiDrawingDTO() {}

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
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

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

}

