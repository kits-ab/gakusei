package se.kits.gakusei;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class GakuseiApplication {

    public static void main(String[] args) {
        SpringApplication.run(GakuseiApplication.class, args);
    }

}

