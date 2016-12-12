package se.kits.gakusei.init;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import se.kits.gakusei.content.model.Fact;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.FactRepository;
import se.kits.gakusei.content.repository.NuggetRepository;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.UserRepository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInit implements ApplicationRunner {

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private NuggetRepository nuggetRepository;

    @Autowired
    private FactRepository factRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void run(ApplicationArguments applicationArguments) throws Exception {
        createUsers();
        createTestData(readTestDataFromFile());
    }

    private List<TestDataHolder> readTestDataFromFile() {
        String testDataFile = "testdata/testdata.json";

        ObjectMapper mapper = new ObjectMapper();
        Resource resource = resourceLoader.getResource("classpath:" + testDataFile);
        logger.info("Loaded resource");
        try {
            File json = resource.getFile();
            List<TestDataHolder> dataHolders = mapper.readValue(
                    json,
                    mapper.getTypeFactory().constructCollectionType(
                            List.class, TestDataHolder.class));
            logger.info(dataHolders.toString());
            return dataHolders;
        } catch (IOException e) {
            logger.error("Unable to parse " + testDataFile);
            e.printStackTrace();
            return null;
        }
    }

    private void createTestData(List<TestDataHolder> dataHolders) {
        for (TestDataHolder tdh : dataHolders) {
            Nugget nugget = tdh.createNugget();
            List<Fact> facts = tdh.createFacts();
            Nugget savedNugget = nuggetRepository.save(nugget);
            savedNugget.setFacts(facts);
            for (Fact fact : facts) {
                fact.setNugget(savedNugget);
            }
            factRepository.save(facts);
        }
    }

    private void createUsers() {
        List<User> users = new ArrayList<>();
        users.add(new User("pieru", passwordEncoder.encode("gakusei"), "ROLE_USER"));
        users.add(new User("yoakimu", passwordEncoder.encode("gakusei"), "ROLE_USER"));
        users.add(new User("pa", passwordEncoder.encode("gakusei"), "ROLE_USER"));
        users.add(new User("debiddo", passwordEncoder.encode("gakusei"), "ROLE_USER"));
        users.add(new User("admin", passwordEncoder.encode("gakusei"), "ROLE_ADMIN"));
        userRepository.save(users);
    }
}
