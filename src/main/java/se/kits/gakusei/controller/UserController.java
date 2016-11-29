package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import se.kits.gakusei.model.User;
import se.kits.gakusei.repository.UserRepository;

/**
 * Created by Pär Svedberg on 2016-11-29.
 */

@RestController
@RequestMapping(value = "users")
public class UserController {

    @Autowired
    private UserRepository ur;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<User> getUser(@PathVariable("id") Long id) {
        User user = ur.findOne(id);
        if (user == null) {
            return new ResponseEntity<User>(user, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<User>(ur.findOne(id), HttpStatus.OK);
    }
}
