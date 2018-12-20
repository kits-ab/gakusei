package se.kits.gakusei.kanjiclient.dto;

public class KanjiDrawingDTO {
    private String data;
    private String difficulty;
    private String nuggetid;
    private long timestamp;
    private String username;

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getNuggetid() {
        return nuggetid;
    }

    public void setNuggetid(String nuggetid) {
        this.nuggetid = nuggetid;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
