package se.kits.gakusei.dto;

public class EventDTO {

    private long timestamp;
    private String gamemode;
    private String type;
    private String data;
    private String username;

    public EventDTO(){}

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

    public String  getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
