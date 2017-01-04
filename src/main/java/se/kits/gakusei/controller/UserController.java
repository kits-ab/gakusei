//package se.kits.gakusei.controller;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.RestController;
//import se.kits.gakusei.user.model.User;
//import se.kits.gakusei.user.repository.UserRepository;
//
//@RestController
//public class UserController {
//
//    @Autowired
//    private UserRepository ur;
//
//    @Autowired
//    PasswordEncoder passwordEncoder;
//
//    private Logger logger = LoggerFactory.getLogger(this.getClass());
//
//    @RequestMapping(
//            value = "/api/users",
//            method = RequestMethod.POST,
//            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
//            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
//    )
//    public ResponseEntity<User> createUser(@RequestBody User user) {
//        final String userRole = "ROLE_USER";
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        user.setRole(userRole);
//        return new ResponseEntity<User>(ur.save(user), HttpStatus.CREATED);
//    }
//
//    @RequestMapping(
//            value = "/api/users",
//            method = RequestMethod.GET,
//            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
//    )
//    public ResponseEntity<Iterable<User>> getUsers() {
//        Iterable<User> users = ur.findAll();
//        if (users == null) {
//            return new ResponseEntity<Iterable<User>>(HttpStatus.FORBIDDEN);
//        }
//        return new ResponseEntity<Iterable<User>>(users, HttpStatus.OK);
//    }
//}
