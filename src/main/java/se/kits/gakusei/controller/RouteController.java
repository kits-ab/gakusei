package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestController;

import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.util.QuestionHandler;

@Controller
public class RouteController {

    // To not disrupt any resources
    @RequestMapping(
        value = {
            "/",
            "/login",
            "/logout",
            "/play/**",
            "/select/**",
            "/translate",
            "/finish/**",
            "/home",
            "/about"
        },
        method = RequestMethod.GET
    )
    @GetMapping("/{path:(?!.*.js|.*.css|.*.jpg).*$}")
    public String index() {
        return "index";
    }

}

