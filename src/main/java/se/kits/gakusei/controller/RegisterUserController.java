package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.UserRepository;

import javax.validation.Valid;

@Controller
public class RegisterUserController {
    @Autowired
    UserRepository userRepo;

    @Autowired
    PasswordEncoder passwordEncoder;

    @RequestMapping(value = "/registeruser", method = RequestMethod.POST)
    public ResponseEntity<String> registerUser(
        @RequestBody
        String input
    ) {
        User user = null;
        User existingUser = null;

        String[] values = input.split("&");
        if (values != null && values.length > 1) // TODO: Validate User fields
        {
            String[] usernameKeyValue = values[0].split("=");
            String[] passwordKeyValue = values[1].split("=");
            System.out.println(usernameKeyValue.length);
                if (usernameKeyValue.length > 1 && passwordKeyValue.length > 1) {
                    String username = usernameKeyValue[1];
                    String password = passwordKeyValue[1];
                    user = new User();
                    user.setUsername(username);
                    user.setPassword(passwordEncoder.encode(password));
                    user.setRole("ROLE_USER");
                }
        }// Check if User exists

        if (user == null) {
            return new ResponseEntity<String>(
                "Form data was incorrect",
                HttpStatus.BAD_REQUEST
            );
        } else {
            existingUser = userRepo.findByUsername(user.getUsername());
        }
        if (existingUser != null) {//TODO: show user that the username is taken

            return new ResponseEntity<String>(
                "Username already in use",
                HttpStatus.UNPROCESSABLE_ENTITY
            );
        }
        System.out.println(user.getUsername().length());
        if( user.getUsername().length() > 1 && user.getUsername().length() < 32){

            userRepo.save(user);
            return new ResponseEntity<String>(
                    "User created: " + user.getUsername(),
                    HttpStatus.CREATED
            );
        }
        else{
            return new ResponseEntity<String>(
                    "Username length must be 2-32 characters",
                    HttpStatus.NOT_ACCEPTABLE
            );

        }
    }
}

