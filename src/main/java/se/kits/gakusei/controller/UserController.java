package se.kits.gakusei.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import se.kits.gakusei.config.UserDetailsServiceImpl;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.UserRepository;

@RestController
@Api(value = "UserController", description = "Operations for handling users")
public class UserController {
    @Autowired
    private UserRepository ur;

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    PasswordEncoder passwordEncoder;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

/*    @ApiOperation(value="Creating a user", response = ResponseEntity.class)
    @RequestMapping(
        value = "/api/users",
        method = RequestMethod.POST,
        consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<User> createUser(
        @RequestBody
        User user
    ) {
        final String userRole = "ROLE_USER";
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(userRole);
        return new ResponseEntity<User>(ur.save(user), HttpStatus.CREATED);
    }*/

    @ApiOperation(value = "Getting all the users", response = ResponseEntity.class)
    @RequestMapping(
            value = "/api/users",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Iterable<User>> getUsers() {
        Iterable<User> users = ur.findAll();
        return (users == null) ? new ResponseEntity<Iterable<User>>(
                HttpStatus.FORBIDDEN
        ) : new ResponseEntity<Iterable<User>>(users, HttpStatus.OK);
    }

    @ApiOperation(value = "Getting the current username", response = ResponseEntity.class)
    @RequestMapping(
            value = "/username",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    @ResponseBody
    public Map<String, Object> currentUserName(Authentication authentication) {
        Map<String, Object> values = new HashMap<>();
        String nameKey = "username";
        String authenticatedKey = "loggedIn";
        String authoritiesKey = "authorities";
        values.put(nameKey, "");
        values.put(authenticatedKey, Boolean.FALSE);
        values.put(authoritiesKey, new ArrayList<>());
        if (authentication != null && authentication.isAuthenticated()) {
            values.put(nameKey, authentication.getName());
            values.put(authenticatedKey, Boolean.TRUE);
            values.put(authoritiesKey, authentication.getAuthorities());
        }
        return values;
    }

    @RequestMapping(value = "/api/changepassword", method = RequestMethod.POST)
    public ResponseEntity<?> changePassword(@RequestBody String userData) {

        JSONObject jsonData = new JSONObject();
        JSONParser jsonParser = new JSONParser();
        try {
            jsonData = (JSONObject) jsonParser.parse(userData);
        } catch (Exception e) {
            e.printStackTrace();
        }
        User user = ur.findByUsername(jsonData.get("username").toString());

        if (user == null) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        } else if (!passwordEncoder.matches(jsonData.get("oldPass").toString(), user.getPassword())) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);

        } else {
            user.setPassword(passwordEncoder.encode(jsonData.get("newPass").toString()));
            ur.save(user);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/api/checkNewUser", method = RequestMethod.POST)
    public ResponseEntity<?> checkNewUser(@RequestBody String username) {
        try {
            User user = ur.findByUsername(username);
            if (user.isNewUser()) {
                user.setNewUser(false);
                ur.save(user);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
            }
        } catch (NullPointerException n){
            n.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}

