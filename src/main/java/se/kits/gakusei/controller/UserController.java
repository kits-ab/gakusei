package se.kits.gakusei.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.UserRepository;

@RestController
public class UserController {
    @Autowired
    private UserRepository ur;

    @Autowired
    PasswordEncoder passwordEncoder;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

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
    }

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

}

