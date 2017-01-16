package se.kits.gakusei.init;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import se.kits.gakusei.content.model.Fact;
import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.FactRepository;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.NuggetRepository;
//import se.kits.gakusei.user.model.User;
//import se.kits.gakusei.user.repository.UserRepository;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class DataInit implements ApplicationRunner {

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private NuggetRepository nuggetRepository;

    @Autowired
    private FactRepository factRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private Environment environment;

//    @Autowired
//    private UserRepository userRepository;

//    @Autowired
//    private PasswordEncoder passwordEncoder;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Value("${gakusei.data-init}")
    private boolean datainit;

    @Override
    public void run(ApplicationArguments applicationArguments) throws Exception {
//        createUsers();

        String activeProfiles = Arrays.toString(environment.getActiveProfiles());
        if (datainit) {
            createTestData(readTestDataFromFile());
            createLessons();
            logger.info("*** Data initialization was set on profile(s): " + activeProfiles);
        } else {
            logger.info("*** Data initialization was NOT set on profile(s): " + activeProfiles);
        }
    }

    private Set<Map<String, Object>> readTestDataFromFile() {
        String testDataFile = "testdata/testdata.json";

        ObjectMapper mapper = new ObjectMapper();
        Resource resource = resourceLoader.getResource("classpath:" + testDataFile);
        logger.info("Loaded resource");
        try (InputStream json = resource.getInputStream()) {
            Set<Map<String, Object>> dataHolders = mapper.readValue(json,new TypeReference<Set<Map<String, Object>>>(){});
            logger.info(dataHolders.toString());
            return dataHolders;
        } catch (IOException e) {
            logger.error("Unable to parse " + testDataFile);
            e.printStackTrace();
            return null;
        }
    }

    private void createTestData(Set<Map<String, Object>> dataHolders) {
        for (Map<String, Object> tdh : dataHolders) {
            Nugget nugget = new Nugget(tdh.get("type").toString());
            nugget.setDescription(tdh.get("english").toString());
            List<Fact> facts = new ArrayList<>();
            for (Map.Entry entry : tdh.entrySet()) {
                String type = entry.getKey().toString();
                if (type.equals("type") || type.equals("state")) {
                    if (entry.getValue().toString().equals("hidden")) {
                        nugget.setHidden(true);
                    }
                    continue;
                }
                Fact fact = new Fact();
                fact.setType(type);
                fact.setData(entry.getValue().toString());
                facts.add(fact);
            }
            Nugget savedNugget = nuggetRepository.save(nugget);
            savedNugget.setFacts(facts);
            for (Fact fact : facts) {
                fact.setNugget(savedNugget);
            }
            factRepository.save(facts);
        }
    }

//    private void createUsers() {
//        List<User> users = new ArrayList<>();
//        users.add(new User("pieru", passwordEncoder.encode("gakusei"), "ROLE_USER"));
//        users.add(new User("yoakimu", passwordEncoder.encode("gakusei"), "ROLE_USER"));
//        users.add(new User("pa", passwordEncoder.encode("gakusei"), "ROLE_USER"));
//        users.add(new User("debiddo", passwordEncoder.encode("gakusei"), "ROLE_USER"));
//        users.add(new User("admin", passwordEncoder.encode("gakusei"), "ROLE_ADMIN"));
//        userRepository.save(users);
//    }

    private void createLessons() {
        Map<String, List<Nugget>> nuggetMap = nuggetRepository.findAll().stream().collect(Collectors.groupingBy(Nugget::getType));
        List<Lesson> lessons = new ArrayList<>();
        for (String wordType : nuggetMap.keySet()) {
            Lesson l = new Lesson();
            l.setName(wordType.substring(0, 1).toUpperCase() + wordType.substring(1) + "s");
            l.setDescription("All nuggets with type '" + wordType + "'");
            l.setNuggets(nuggetMap.get(wordType));
            lessons.add(l);
        }
        lessonRepository.save(lessons);
    }
}
