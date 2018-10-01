package se.kits.gakuseiStat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import se.kits.gakuseiStat.Controller.EventsController;

@SpringBootApplication
public class StatappApplication {

    public static void main(String[] args) {
        SpringApplication.run(StatappApplication.class, args);
    }


}
