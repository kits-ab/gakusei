package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.UserRepository;

@Controller
public class RegisterUserController {

    @Autowired
    UserRepository userRepo;

    @Autowired
    PasswordEncoder passwordEncoder;

    @RequestMapping(value = "/registeruser", method = RequestMethod.POST)
    public ModelAndView registerUser(@RequestBody String input) {
        User user = null;
        User existingUser = null;

        String[] values = input.split("&");
        if (values != null && values.length > 1) {
            String username = values[0].split("=")[1];
            String password = values[1].split("=")[1];
            // Validate User fields

            user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole("ROLE_USER");
        }
        // Check if User exists
        if (user != null) {
            existingUser = userRepo.findByUsername(user.getUsername());
        }
        if(existingUser != null) {
            //TODO: show user that the username is taken
            return new ModelAndView("redirect:" + "/?registrationError");
        }
        userRepo.save(user);
        return new ModelAndView("redirect:" + "/");
    }
}
