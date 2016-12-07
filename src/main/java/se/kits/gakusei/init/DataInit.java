package se.kits.gakusei.init;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import se.kits.gakusei.content.model.Fact;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.FactRepository;
import se.kits.gakusei.content.repository.NuggetRepository;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Component
public class DataInit implements ApplicationRunner {

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private NuggetRepository nuggetRepository;

    @Autowired
    private FactRepository factRepository;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void run(ApplicationArguments applicationArguments) throws Exception {
        createTestData(readTestDataFromFile());
//        readTestDataFromFile();
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
}
