package se.kits.gakusei.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.EventRepository;
import se.kits.gakusei.user.repository.UserRepository;

@RestController
@Api(value="StatisticsController", description="Operations for handeling statistics")
public class StatisticsController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    EventRepository eventRepository;

    @ApiOperation(value="Get succes rate from a user", response = ResponseEntity.class)
    @RequestMapping(
        value = "/api/statistics/{user}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Integer> getSuccessRate(
        @PathVariable("user")
        String username
    ) {
        User user = userRepository.findByUsername(username);
        return (user != null) ? new ResponseEntity<Integer>(
            eventRepository.getUserSuccessRate(user.getUsername()),
            HttpStatus.OK
        ) : new ResponseEntity<Integer>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

