package se.kits.gakuseiclient.service;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.shell.Availability;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;
import org.springframework.shell.standard.ShellOption;
import se.kits.gakuseiclient.model.Auth;

import javax.validation.constraints.Size;

@ShellComponent
public class LoginService {

    private boolean loggedIn = false;

    @Autowired
    Auth auth;

    @ShellMethod(value = "Login to Gakusei. \n\t\t\t@Param username (Default value is 'test') " +
            "\n\t\t\t@Param password (Default value is 'test')", key = "login")
    public void login(@ShellOption(defaultValue = "test") @Size(min = 2, max = 100) String un,
                      @ShellOption(defaultValue = "test") @Size(min = 2, max = 100) String pw){
        loggedIn = auth.login(un, pw);
    }

    @ShellMethod(value = "Get the logged in user.", key = "get user")
    public void loggedInUser(){
        auth.getLoggedInUser();
    }

    @ShellMethod(value = "Log out of Gakusei.", key = "logout")
    public void logout(){
        loggedIn = !auth.logout();
    }

    @ShellMethod(value = "Get your JSESSIONID.", key = "get jsid")
    public String getJSessionId(){
        return "Your JSESSIONID is: " + auth.getjSessionId();
    }

    @ShellMethod(value = "Change password. \n\t\t\t@Param old password " +
            "\n\t\t\t@Param new password", key = "change password")
    public void changePassword(@ShellOption @Size(min = 2, max = 100) String oldPass,
                               @ShellOption @Size(min = 2, max = 100) String newPass){
        auth.changePassword(oldPass, newPass);
    }

    public Availability loginAvailability(){
        return loggedIn ? Availability.unavailable("someone is already logged in. Log out to login with another user.")
                : Availability.available();
    }

    public Availability loggedInUserAvailability(){
        return loggedIn ? Availability.available()
                : Availability.unavailable("there is no logged in user.");
    }

    public Availability getJSessionIdAvailability(){
        return loggedIn ? Availability.available()
                : Availability.unavailable("there is no logged in user.");
    }

    public Availability changePasswordAvailability(){
        return loggedIn ? Availability.available()
                : Availability.unavailable("there is no logged in user.");
    }

    public Availability logoutAvailability(){
        return loggedIn ? Availability.available()
                : Availability.unavailable("there is no logged in user.");
    }
}
