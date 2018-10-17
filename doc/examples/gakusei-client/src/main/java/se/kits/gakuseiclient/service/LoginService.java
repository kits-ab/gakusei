package se.kits.gakuseiclient.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;
import org.springframework.shell.standard.ShellOption;
import se.kits.gakuseiclient.model.Auth;

@ShellComponent
public class LoginService {

    @Autowired
    Auth auth;

    @ShellMethod(value = "Login to Gakusei. \n\t\t\t@Param username (Default value is 'test') " +
            "\n\t\t\t@Param password (Default value is 'test')", key = "login")
    public void login(@ShellOption(defaultValue = "test") String un, @ShellOption(defaultValue = "test") String pw){
        auth.login(un, pw);
    }

    @ShellMethod(value = "Get the logged in user.", key = "get user")
    public void loggedInUser(){
        auth.getLoggedInUser();
    }

    @ShellMethod(value = "Log out of Gakusei.", key = "logout")
    public void logout(){
        auth.logout();
    }

    @ShellMethod(value = "Get your JSESSIONID.", key = "get jsid")
    public String getJSessionId(){
        return "Your JSESSIONID is: " + auth.getjSessionId();
    }
}
