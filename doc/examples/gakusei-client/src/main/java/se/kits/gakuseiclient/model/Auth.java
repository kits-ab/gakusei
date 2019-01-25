package se.kits.gakuseiclient.model;

import org.json.simple.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.io.Serializable;
import java.util.List;

@Component
public class Auth implements Serializable {

    //private static final String REST_SERVICE_URI = "https://staging.daigaku.se";
    private static final String REST_SERVICE_URI = "http://localhost:8080";

    private String cookie;
    private String user;
    private String jSessionId;

    public Auth(){ }

    @PostConstruct
    public void init(){

        /*
        System.out.println("logging in...");
        login("test", "test");

        System.out.println("Getting logged in user...");
        getLoggedInUser();

        System.out.println("logging out...");
        logout();

        System.out.println("Getting logged in user after logout...");
        getLoggedInUser();

        System.out.println("The end!");
        */
    }

    public boolean login(String username, String password){

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        ResponseEntity<String> response;

        LinkedMultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("username", username);
        form.add("password", password);

        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<LinkedMultiValueMap<String, String>> request = new HttpEntity<>(form, headers);

        try {
            response = restTemplate.exchange(REST_SERVICE_URI+"/auth", HttpMethod.POST, request, String.class);

            headers = response.getHeaders();
            List<String> setCookie = headers.get(headers.SET_COOKIE);
            this.setCookie(setCookie.get(0).split(";")[0]);
            this.setjSessionId(cookie.split("=")[1]);
            getLoggedInUser();
            return true;

        } catch (HttpClientErrorException e) {

            System.out.println("Server response: " + e.getStatusCode());
            System.out.println("Make sure you provide the correct credentials");
            return false;
        }


    }


    //@PostConstruct
    public String getLoggedInUser(){

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();

        headers.add("Cookie", this.getCookie());
        HttpEntity httpEntity = new HttpEntity<>(null, headers);
        ResponseEntity<String> responseEntity = restTemplate.exchange(REST_SERVICE_URI+"/username",
                HttpMethod.GET, httpEntity, String.class);
        System.out.println("Server response: " + responseEntity.getStatusCode());
        if( responseEntity.getBody().split(",")[0].contains("false") ) {
            System.out.println("There is no logged in user.");
        }else{
            user = responseEntity.getBody().split("\"")[responseEntity.getBody().split("\"").length - 2];
            System.out.println("The logged in user is: " + user);
        }
        return user;
    }

    public boolean logout(){
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", this.getCookie());
        HttpEntity httpEntity = new HttpEntity<>(null, headers);
        ResponseEntity<String> responseEntity = restTemplate.exchange(REST_SERVICE_URI+"/logout",
                HttpMethod.POST, httpEntity, String.class);
        if(responseEntity.getStatusCodeValue() == 302) {
            this.setUser(null);
            this.setjSessionId(null);
            System.out.println("Server response: " + responseEntity.getStatusCodeValue());
            System.out.println("Server redirects to " + responseEntity.getHeaders().get("Location"));
            System.out.println("Logged out successfully.");
            return true;
        }else{
            System.out.println("Server response: " + responseEntity.getStatusCodeValue());
            return false;
        }
    }

    public void changePassword(String oldPass, String newPass){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("username", this.user);
        jsonObject.put("oldPass", oldPass);
        jsonObject.put("newPass", newPass);


        RestTemplate restTemplate = new RestTemplate();
        //HttpHeaders headers = new HttpHeaders();
        //headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        //HttpEntity<String> request = new HttpEntity<>(jsonObject.toJSONString(), headers);
        ResponseEntity<HttpStatus> responseEntity = restTemplate.postForEntity(REST_SERVICE_URI+"/api/changepassword",
                jsonObject.toJSONString(), HttpStatus.class);
        if(responseEntity.getStatusCode() == HttpStatus.OK){
            System.out.println("Server response: " + responseEntity.getStatusCodeValue());
            System.out.println("Password was successfully changed!");
        } else if (responseEntity.getStatusCode() == HttpStatus.NOT_ACCEPTABLE){
            System.out.println("Server response: " + responseEntity.getStatusCodeValue());
            System.out.println("Password was not changed because you entered the wrong password.");
        } else {
            System.out.println("Server response: " + responseEntity.getStatusCodeValue());
            System.out.println("Internal server error. Please try again later.");
        }
    }

    private String getCookie() {
        return cookie;
    }

    private void setCookie(String cookie) {
        this.cookie = cookie;
    }

    private String getUser() {
        return user;
    }

    private void setUser(String user) {
        this.user = user;
    }

    public String getjSessionId() {
        return jSessionId;
    }

    private void setjSessionId(String jSessionId) {
        this.jSessionId = jSessionId;
    }
}
