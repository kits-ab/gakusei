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

import java.net.URLDecoder;
import java.util.regex.Pattern;

@Controller
public class RegisterUserController {
    @Autowired
    UserRepository userRepo;

    @Autowired
    PasswordEncoder passwordEncoder;

    private String decodedInput;

    @RequestMapping(value = "/registeruser", method = RequestMethod.POST)
    public ResponseEntity<String> registerUser(
            @RequestBody
                    String input
    ) {
        User user = null;
        User existingUser = null;

        try {
            decodedInput = URLDecoder.decode(input, "utf-8");
        }catch (Exception e){
            System.out.println("Exception caught in decode url: " + e.getMessage());
        }

        String username = decodedInput.substring(decodedInput.indexOf("username=")+("username=").length(),
                decodedInput.indexOf("&password="));
        String password = decodedInput.substring(decodedInput.indexOf("&password=")+("&password=").length(),
                decodedInput.lastIndexOf("&remember"));
        System.out.println("username: " + username + "\npassword: " + password);


        if(!Pattern.matches("^[a-zA-Z0-9]+$",username)){
            return new ResponseEntity<String>("Användarnamnet tillåter endast bokstäver och siffror.",
                    HttpStatus.NOT_ACCEPTABLE);
        }
        if(username.length() < 2 || username.length() > 32){
            return new ResponseEntity<String>(
                    "Användarnamnet måste vara mellan 2 och 32 tecken långt.",
                    HttpStatus.NOT_ACCEPTABLE
            );
        }

        if (decodedInput.contains(" ")){
            return new ResponseEntity<String>("Mellanslag är inte tillåtet i lösenordet.",
                    HttpStatus.NOT_ACCEPTABLE);
        }
        if (password.length() > 100 || password.length() < 3){
            return new ResponseEntity<String>("Lösenordet måste vara mellan 3 och 100 tecken långt.",
                    HttpStatus.NOT_ACCEPTABLE);
        }

        user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("ROLE_USER");

        // Check if User exists

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
