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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import se.kits.gakusei.content.model.*;
import se.kits.gakusei.content.repository.*;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.UserRepository;
import se.kits.gakusei.util.ParserFailureException;
import se.kits.gakusei.util.csv.CSVQuizNugget;
import se.kits.gakusei.util.csv.CSVQuizToDatabase;

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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private IncorrectAnswerRepository incorrectAnswerRepository;

    @Autowired
    private QuizNuggetRepository quizNuggetRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private WordTypeRepository wordTypeRepository;

    @Autowired
    private BookRepository bookRepository;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Value("${gakusei.data-init}")
    private boolean datainit;

    @Override
    public void run(ApplicationArguments applicationArguments) throws Exception {

        String activeProfiles = Arrays.toString(environment.getActiveProfiles());
        if (datainit) {
            String testDataFile = "testdata/testdata.json";
            String csvQuizNuggetFile = "testdata/quizzes.csv";

            createUsers();
            createTestData(readTestDataFromFile(testDataFile));
            createLessons();
            createQuizzesFromCSV(csvQuizNuggetFile);

            logger.info("*** Data initialization was set on profile(s): " + activeProfiles);
        } else {
            logger.info("*** Data initialization was NOT set on profile(s): " + activeProfiles);
        }
    }

    private Set<Map<String, Object>> readTestDataFromFile(String testDataFile) {
                ObjectMapper mapper = new ObjectMapper();
        Resource resource = resourceLoader.getResource("classpath:" + testDataFile);
        logger.info("Loaded resource: " + testDataFile);
        try (InputStream json = resource.getInputStream()) {
            Set<Map<String, Object>> dataHolders = mapper.readValue(json,new TypeReference<Set<Map<String, Object>>>(){});
            logger.debug(dataHolders.toString());
            return dataHolders;
        } catch (IOException e) {
            logger.error("Unable to parse " + testDataFile, e);
            return null;
        }
    }

    private void createTestData(Set<Map<String, Object>> dataHolders) {
        for (Map<String, Object> tdh : dataHolders) {
            try {
                Nugget nugget = new Nugget(((ArrayList<String>) tdh.get("type")).get(0));
                nugget.setDescription(((ArrayList<String>) tdh.get("english")).get(0));
                String nuggetType = ((ArrayList<String>) tdh.get("type")).get(0);

                // skip handling kanji nuggets until kanji gets its own table
                if (!nuggetType.equals("kanji")) {
                    nugget.setEnglish(((ArrayList<String>) tdh.get("english")).get(0));
                    nugget.setSwedish(((ArrayList<String>) tdh.get("swedish")).get(0));
                    nugget.setJpRead(((ArrayList<String>) tdh.get("reading")).get(0));
                    nugget.setJpWrite(((ArrayList<String>) tdh.get("writing")).get(0));

                    WordType wordType = wordTypeRepository.findByType(nuggetType);

                    if (wordType == null) {
                        wordType = new WordType();
                        wordType.setType(nuggetType);
                        wordTypeRepository.save(wordType);
                    }

                    nugget.setWordType(wordType);
                }

                List<Fact> facts = new ArrayList<>();
                Set<String> typeSet = new HashSet<>(Arrays.asList("type", "state", "id"));
                List<Book> books = new ArrayList<>();
                Set<String> allKeysExceptBooks = new HashSet<>(Arrays.asList("type", "english", "swedish", "id",
                        "state", "reading", "writing", "kanjidrawing"));
                for (Map.Entry entry : tdh.entrySet()) {
                    String type = entry.getKey().toString();
                    if (typeSet.contains(type)) {
                        if (entry.getValue().toString().equals("hidden")) {
                            nugget.setHidden(true);
                        }
                        continue;
                    }
                    if (!allKeysExceptBooks.contains(type)) {
                        Object bookData = entry.getValue();
                        String chapter;
                        if (bookData instanceof String) {
                            chapter = bookData.toString();
                        } else {
                            chapter = ((ArrayList<String>) entry.getValue()).get(0);
                        }
                        String title = type.concat(" " + chapter);
                        Book book = bookRepository.findByTitle(title);
                        if (book == null) {
                            book = new Book();
                            book.setTitle(title);
                            bookRepository.save(book);
                        }
                        books.add(book);
                    }
                    Fact fact = new Fact();
                    fact.setType(type);
                    Object data = entry.getValue();
                    if (data instanceof String) {
                        fact.setData(data.toString());
                    } else {
                        fact.setData(((ArrayList<String>) entry.getValue()).get(0));
                    }
                    facts.add(fact);
                }
                nugget.setBooks(books);
                Nugget savedNugget = nuggetRepository.save(nugget);
                savedNugget.setFacts(facts);
                for (Fact fact : facts) {
                    fact.setNugget(savedNugget);
                }
                factRepository.save(facts);
            } catch (Exception e) {
                logger.warn("Faulty nugget detected, skipping: " + tdh);
            }
        }
    }

    private void createUsers() {
        List<User> users = new ArrayList<>();
        users.add(new User("nulluser", passwordEncoder.encode("gakusei"), "NULL_USER"));
        users.add(new User("pieru", passwordEncoder.encode("gakusei"), "ROLE_USER"));
        users.add(new User("yoakimu", passwordEncoder.encode("gakusei"), "ROLE_USER"));
        users.add(new User("pa", passwordEncoder.encode("gakusei"), "ROLE_USER"));
        users.add(new User("debiddo", passwordEncoder.encode("gakusei"), "ROLE_USER"));
        users.add(new User("admin", passwordEncoder.encode("gakusei"), "ROLE_ADMIN"));
        userRepository.save(users);
    }

    private void createLessons() {
        createVerbLesson();
        createLessonsByCategory("kll");
        createLessonsByCategory("jlpt");
        createLessonsByCategory("genki");
        createLessonsByCategory("quiz");
    }

    private void createVerbLesson() {
        List<Nugget> verbNuggets = nuggetRepository.findAll().stream().filter(n -> n.getType().equals("verb"))
                .collect(Collectors.toList());
        Lesson lesson = new Lesson();
        lesson.setName("Verbs");
        lesson.setDescription("All nuggets with type verb");
        lesson.setNuggets(verbNuggets);
        lessonRepository.save(lesson);
    }

    private void createLessonsByCategory(String category) {
        List<Nugget> nuggets = nuggetRepository.findAll().stream()
                .filter(n -> n.getFacts().stream().anyMatch(f -> category.equals(f.getType())))
                .collect(Collectors.toList());
        if (nuggets.isEmpty()) return;

        Map<String, List<Nugget>> nuggetMap = new HashMap<>();
        for (Nugget n : nuggets) {
            Fact fact = n.getFacts().stream().filter(f -> category.equals(f.getType())).findFirst().get();

            String lessonName = fact.getType().equals("quiz") ?
                    fact.getData() :
                    (fact.getType() + " " + fact.getData()).toUpperCase();
            nuggetMap.computeIfAbsent(lessonName, k -> new ArrayList<>()).add(n);
        }
        List<Lesson> lessons = new ArrayList<>();
        for (String lessonName : nuggetMap.keySet()) {
            Lesson l = new Lesson();
            l.setName(lessonName);
            l.setDescription(category);
            l.setNuggets(nuggetMap.get(lessonName));
            lessons.add(l);
        }
        lessonRepository.save(lessons);
    }

    public void createQuizzesFromCSV(String csvFile) throws Exception {

        CSVQuizToDatabase parser = new CSVQuizToDatabase(resourceLoader.getResource("classpath:" + csvFile).getInputStream());
        List<CSVQuizNugget> csvQuizNuggets = new ArrayList<>();

        try {
            csvQuizNuggets = parser.parse();

        } catch (ParserFailureException e){
            logger.error("Unable to parse " + csvFile, e);
        }

        for (CSVQuizNugget csvQuizNugget : csvQuizNuggets) {
            Quiz newQuiz = csvQuizNugget.getQuiz();
            Quiz quiz = quizRepository.findByName(newQuiz.getName());

            if (quiz == null) {
                quiz = quizRepository.save(newQuiz);
            }

            QuizNugget quizNugget = quizNuggetRepository.save(csvQuizNugget.getQuizNugget(quiz));
            incorrectAnswerRepository.save(csvQuizNugget.getIncorrectAnswers(quizNugget));
        }
    }
}
