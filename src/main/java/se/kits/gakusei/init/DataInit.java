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
import java.util.stream.StreamSupport;

@Component
public class DataInit implements ApplicationRunner {

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private NuggetRepository nuggetRepository;

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

    @Autowired
    private KanjiRepository kanjiRepository;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Value("${gakusei.data-init}")
    private boolean datainit;

    private Set<String> allKeysExceptBooks;

    @Override
    public void run(ApplicationArguments applicationArguments) throws Exception {

        String activeProfiles = Arrays.toString(environment.getActiveProfiles());
        if (datainit) {
            String testDataFile = "testdata/testdata.json";
            String csvQuizNuggetFile = "testdata/quizzes.csv";

            allKeysExceptBooks = new HashSet<>(Arrays.asList("type", "english", "swedish", "id",
                    "state", "reading", "writing", "kanjidrawing"));
            createUsers();
            createTestBooks(readTestDataFromFile(testDataFile));
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

    private void createTestBooks(Set<Map<String, Object>> dataHolders) {
        for (Map<String, Object> tdh : dataHolders) {
            try {
                for (Map.Entry entry : tdh.entrySet()) {
                    String key = entry.getKey().toString();
                    if (!allKeysExceptBooks.contains(key)) {
                        String title = getBookTitle(key, entry.getValue());
                        if (bookRepository.findByTitle(title) == null) {
                            Book book = new Book();
                            book.setTitle(title);
                            bookRepository.save(book);
                        }
                    }
                }
            } catch (Exception e) {
                logger.warn("Faulty book detected, skipping: " + tdh);
            }
        }
    }

    private String getBookTitle(String book, Object chapterData) {
        String chapter;
        if (chapterData instanceof String) {
            chapter = chapterData.toString();
        } else {
            chapter = ((ArrayList<String>) chapterData).get(0);
        }
        return book.concat(" " + chapter);
    }

    private void createKanji(List<Book> books, Map<String, Object> tdh) {
        Kanji kanji = new Kanji();
        kanji.setDescription(((ArrayList<String>)tdh.get("english")).get(0));
        kanji.setEnglish(((ArrayList<String>)tdh.get("english")).get(0));
        kanji.setSwedish(((ArrayList<String>)tdh.get("swedish")).get(0));
        kanji.setKanji(((ArrayList<String>)tdh.get("writing")).get(0));
        kanji.setHidden(tdh.get("state").equals("hidden"));
        kanji.setBooks(books);
        kanjiRepository.save(kanji);
    }

    private void createNugget(List<Book> books, Map<String, Object> tdh) {
        String nuggetType = ((ArrayList<String>) tdh.get("type")).get(0);
        WordType wordType = wordTypeRepository.findByType(nuggetType);
        if (wordType == null) {
            wordType = new WordType();
            wordType.setType(nuggetType);
            wordTypeRepository.save(wordType);
        }

        Nugget nugget = new Nugget();
        nugget.setDescription(((ArrayList<String>) tdh.get("english")).get(0));
        nugget.setEnglish(((ArrayList<String>) tdh.get("english")).get(0));
        nugget.setSwedish(((ArrayList<String>) tdh.get("swedish")).get(0));
        nugget.setJpRead(((ArrayList<String>) tdh.get("reading")).get(0));
        nugget.setJpWrite(((ArrayList<String>) tdh.get("writing")).get(0));
        nugget.setHidden(tdh.get("state").equals("hidden"));
        nugget.setWordType(wordType);
        nugget.setBooks(books);
        nuggetRepository.save(nugget);

    }

    private void createTestData(Set<Map<String, Object>> dataHolders) {
        for (Map<String, Object> tdh : dataHolders) {
            try {
                String nuggetType = ((ArrayList<String>) tdh.get("type")).get(0);
                List<Book> books = new ArrayList<>();

                for (Map.Entry entry : tdh.entrySet()) {
                    String type = entry.getKey().toString();
                    if (!allKeysExceptBooks.contains(type)) {
                        Book book = bookRepository.findByTitle(getBookTitle(type, entry.getValue()));
                        if (!books.contains(book)) {
                            books.add(book);
                        }
                    }
                }

                if (nuggetType.equals("kanji")) {
                    createKanji(books, tdh);
                } else {
                    createNugget(books, tdh);
                }
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
        createLessonsByBooks();
    }

    private void createVerbLesson() {
        List<Nugget> verbNuggets = nuggetRepository.findAll().stream().filter(n -> n.getWordType().getType()
                .equals("verb")).collect(Collectors.toList());
        Lesson lesson = new Lesson();
        lesson.setName("Verbs");
        lesson.setDescription("All nuggets with type verb");
        lesson.setNuggets(verbNuggets);
        lessonRepository.save(lesson);
    }

    private void createLessonsByBooks() {
        lessonRepository.save(StreamSupport.stream(bookRepository.findAll().spliterator(), false)
                .map(this::createLesson).collect(Collectors.toList()));

    }

    private Lesson createLesson(Book book) {
        List<Nugget> nuggets = nuggetRepository.findAll().stream().filter(n -> n.getBooks().stream().map(Book::getId)
                .collect(Collectors.toList()).contains(book.getId())).collect(Collectors.toList());
        List<Kanji> kanjis = StreamSupport.stream(kanjiRepository.findAll().spliterator(), false)
                .filter(k -> k.getBooks().stream().map(Book::getId).collect(Collectors.toList()).contains(book.getId()))
                .collect(Collectors.toList());

        Lesson lesson = new Lesson();
        lesson.setName(book.getTitle());
        lesson.setDescription(book.getTitle());
        lesson.setNuggets(nuggets);
        lesson.setKanjis(kanjis);
        return lesson;
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
