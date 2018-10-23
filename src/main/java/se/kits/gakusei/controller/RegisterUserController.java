package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.UserRepository;

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

        System.out.println("input: " + input);

        String[] values = input.split("&");

        System.out.println("username: " + values[0].split("=")[1] + " password " + values[1].split("=")[1]);

        if (values != null && values.length > 1) // TODO: Validate User fields
        {
            String[] usernameKeyValue = values[0].split("=");
            String[] passwordKeyValue = values[1].split("=");
            if (usernameKeyValue.length > 1 && passwordKeyValue.length > 1) {
                String username = usernameKeyValue[1];
                String password = passwordKeyValue[1];

                if (password.length() > 100 && password.length() < 3){
                    return new ResponseEntity<String>("Please enter a password between 3 and 100 characters",
                            HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE);
                }
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
        userRepo.save(user);
        return new ResponseEntity<String>(
            "User created: " + user.getUsername(),
            HttpStatus.CREATED
        );
    }

}

