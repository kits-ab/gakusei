package se.kits.gakusei.controller;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import se.kits.gakusei.content.model.Lesson;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.model.UserLesson;
import se.kits.gakusei.content.repository.LessonRepository;
import se.kits.gakusei.content.repository.UserLessonRepository;
import se.kits.gakusei.util.ProgressHandler;
import se.kits.gakusei.util.QuestionHandler;

@RestController
public class QuestionController {
    private LessonRepository lessonRepository;

    private QuestionHandler questionHandler;

    private UserLessonRepository userLessonRepository;

    private ProgressHandler progressHandler;

    @Value("${gakusei.questions-quantity}")
    private int quantity;

    @Autowired
    public QuestionController(
            LessonRepository lessonRepository,
            QuestionHandler questionHandler,
            UserLessonRepository userLessonRepository,
            ProgressHandler progressHandler
    ) {
        this.lessonRepository = lessonRepository;
        this.questionHandler = questionHandler;
        this.userLessonRepository = userLessonRepository;
        this.progressHandler = progressHandler;
    }

    @RequestMapping(
            value = "/api/questions",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    ResponseEntity<List<HashMap<String, Object>>> getQuestionsFromLesson(
            @RequestParam(value = "lessonName")
                    String lessonName,
            @RequestParam(value = "lessonType", defaultValue = "vocabulary")
                    String lessonType,
            @RequestParam(name = "questionType", defaultValue = "reading")
                    String questionType,
            @RequestParam(name = "answerType", defaultValue = "swedish")
                    String answerType,
            @RequestParam(name = "username")
                    String username,
            @RequestParam(
                    name = "spacedRepetition",
                    required = false,
                    defaultValue = "false"
            )
                    boolean spacedRepetition
    ) {
        List<HashMap<String, Object>> questions;
        if (!lessonName.equals("Favoriter")) {
            questions = getCachedQuestionsFromLesson(
                    lessonName,
                    lessonType,
                    questionType,
                    answerType,
                    username,
                    spacedRepetition
            );
        } else {
            questions = getCachedQuestionsFromFavoriteLesson(
                    lessonType,
                    questionType,
                    answerType,
                    username,
                    spacedRepetition
            );
        }
        return questions.isEmpty() ? new ResponseEntity<>(
                HttpStatus.INTERNAL_SERVER_ERROR
        ) : new ResponseEntity<>(questions, HttpStatus.OK);
    }

    @RequestMapping(
            value = "/api/wrongquestions",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    ResponseEntity<List<HashMap<String, Object>>> createWrongAnswersQuestions(
            @RequestParam(value = "questionType") String questionType,
            @RequestParam(value = "answerType") String answerType,
            @RequestParam(value = "userName") String userName){
        List<HashMap<String, Object>> questions;

        questions = getCachedQuestionsFromWrongAnswers(userName, questionType, answerType);

        //returnerar en lista av nuggets en användare har svarat fel på
        return questions.isEmpty() ? new ResponseEntity<>(
                HttpStatus.NO_CONTENT
        ) : new ResponseEntity<>(questions, HttpStatus.OK);
    }

    private List<HashMap<String, Object>> getCachedQuestionsFromWrongAnswers(
            String userName,
            String questionType,
            String answerType
    ){
        List<Nugget> wrongNuggets = progressHandler.getWrongQuestions(userName);
        if(wrongNuggets.isEmpty()){
            //hantera om man inte har några fel
            List<HashMap<String, Object>> wrongNuggetEmpty = new ArrayList<>();
            // because it works...
            return wrongNuggetEmpty;
        }
        List<Nugget> extraNuggets = wrongNuggets.get(0).getLessons().get(0).getNuggets();
        Collections.shuffle(wrongNuggets);


        //Får en lista av nuggets som man har svarat fel på
        return questionHandler.createSpacedRepetitionQuestions(
                wrongNuggets,
                extraNuggets,
                questionType,
                answerType
        ).subList(0, Math.min(wrongNuggets.size(), quantity));
    }
    private List<HashMap<String, Object>> getCachedQuestionsFromFavoriteLesson(
            String lessonType,
            String questionType,
            String answerType,
            String username,
            boolean spacedRepetition
    ) {//get all favorites, for each get unanswered and hard ones

        List<Lesson> favoriteLessons = userLessonRepository.findUsersStarredLessons(
                username).stream().map(UserLesson::getLesson).collect(Collectors.toList());
        List<Nugget> favoriteNuggets;
        List<Nugget> allLessonNuggets;
        if (!lessonType.equals("grammar")) {
            allLessonNuggets = getAllLessonNuggets(favoriteLessons);
            Collections.shuffle(allLessonNuggets);
            //Create list for Extra alternatives for incorrect answers
            if (spacedRepetition && allLessonNuggets.size() > 30) {//Max size of alternatives
                allLessonNuggets = allLessonNuggets.subList(0, 30);
            }
        } else {
            allLessonNuggets = getAllGrammarLessonNuggets(favoriteLessons);

        }
        if (spacedRepetition) {
            favoriteNuggets = questionHandler.chooseRetentionNuggets(
                    getFavouriteRetentionNuggets(username, favoriteLessons),
                    getUnansweredRetentionNuggets(username, favoriteLessons),
                    quantity
            );
        } else {
            favoriteNuggets = questionHandler.chooseNuggets(
                    getNuggetsWithLowSuccessrate(username, favoriteLessons),
                    getUnansweredNuggets(username, favoriteLessons),
                    allLessonNuggets,
                    quantity
            );
        }
        if (lessonType.equals("grammar")) {
            return questionHandler.createGrammarQuestions(
                    lessonRepository.findByName(null),
                    favoriteNuggets,
                    questionType,
                    answerType
            );
            //TODO: Fix favorite-mode for grammar questions.
        } else {
            return questionHandler.createSpacedRepetitionQuestions(
                    favoriteNuggets,
                    allLessonNuggets,
                    questionType,
                    answerType
            );
        }
    }

    //Start of Favorited lessons methods
    private List<Nugget> getAllLessonNuggets(List<Lesson> favoriteLessons) {
        return favoriteLessons.stream().map(
                lesson -> cachedFindNuggets(lesson.getName())
        ).flatMap(List::stream).collect(Collectors.toList());
    }

    private List<Nugget> getAllGrammarLessonNuggets(List<Lesson> favoriteLessons) {
        return favoriteLessons.stream().map(
                lesson -> cachedFindVerbNuggets(lesson.getName())
        ).flatMap(List::stream).collect(Collectors.toList());
    }

    private List<Nugget> getNuggetsWithLowSuccessrate(String username, List<Lesson> favoriteLessons) {
        return favoriteLessons.stream().map(
                lesson -> lessonRepository.findNuggetsBySuccessrate(
                        username,
                        lesson.getName()
                )
        ).flatMap(List::stream).collect(Collectors.toList());
    }

    private List<Nugget> getUnansweredNuggets(String username, List<Lesson> favoriteLessons) {
        return favoriteLessons.stream().map(
                lesson -> lessonRepository.findUnansweredNuggets(
                        username,
                        lesson.getName()
                )
        ).flatMap(List::stream).collect(Collectors.toList());
    }

    private List<Nugget> getFavouriteRetentionNuggets(String username, List<Lesson> favoriteLessons){
        return favoriteLessons.stream().map(
                lesson -> lessonRepository.findNuggetsByRetentionDate(
                        username,
                        lesson.getName()
                )
        ).flatMap(List::stream).collect(Collectors.toList());
    }

    private List<Nugget> getUnansweredRetentionNuggets(String username, List<Lesson> favoriteLessons) {
        return favoriteLessons.stream().map(
                lesson -> lessonRepository.findUnansweredRetentionNuggets(
                        username,
                        lesson.getName()
                )
        ).flatMap(List::stream).collect(Collectors.toList());
    }
    //End of Favorited lesson methods

    private List<HashMap<String, Object>> getCachedQuestionsFromLesson(
            String lessonName,
            String lessonType,
            String questionType,
            String answerType,
            String username,
            boolean spacedRepetition
    ) {
        List<Nugget> allLessonNuggets;
        if (lessonType.equals("grammar")) {
            allLessonNuggets = cachedFindVerbNuggets(lessonName);
        } else {
            allLessonNuggets = cachedFindNuggets(lessonName);
        }
        List<Nugget> nuggets;
        if (spacedRepetition) {
            nuggets = questionHandler.chooseRetentionNuggets(
                    getRetentionNuggets(username, lessonName),
                    getUnansweredRetentionNuggets(username, lessonName),
                    quantity
            );
        } else {
            nuggets = questionHandler.chooseNuggets(
                    getNuggetsWithLowSuccessrate(username, lessonName),
                    getUnansweredNuggets(username, lessonName),
                    allLessonNuggets,
                    quantity
            );
        }
        if (lessonType.equals("grammar")) {
            return questionHandler.createGrammarQuestions(
                    lessonRepository.findByName(lessonName),
                    nuggets,
                    questionType,
                    answerType
            );
        } else {
            if (spacedRepetition) {
                return questionHandler.createSpacedRepetitionQuestions(
                        nuggets,
                        allLessonNuggets,
                        questionType,
                        answerType
                );
            } else {
                return questionHandler.createQuestions(
                        nuggets,
                        questionType,
                        answerType
                );
            }
        }
    }

    //Start of Single lesson methods
    private List<Nugget> getRetentionNuggets(String username, String lessonName) {
        return lessonRepository.findNuggetsByRetentionDate(
                username,
                lessonName
        );
    }

    private List<Nugget> getUnansweredRetentionNuggets(String username, String lessonName) {
        return lessonRepository.findUnansweredRetentionNuggets(
                username,
                lessonName
        );
    }
    private List<Nugget> getNuggetsWithLowSuccessrate(String username, String lessonName) {
        return lessonRepository.findNuggetsBySuccessrate(
                username,
                lessonName
        );
    }
    private List<Nugget> getUnansweredNuggets(String username, String lessonName){
        return lessonRepository.findUnansweredNuggets(
                username,
                lessonName
        );
    }
    //End of Single lesson methods

    @Cacheable("otherNuggets")
    public List<Nugget> cachedFindNuggets(String lessonName) {
        return lessonRepository.findByName(lessonName).getNuggets();
    }

    @Cacheable("verbNuggets")
    public List<Nugget> cachedFindVerbNuggets(String lessonName) {
        return lessonRepository.findVerbNuggets(
                lessonRepository.findByName(lessonName).getId()
        );
    }
}


