package se.kits.gakusei.controller;

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
import se.kits.gakusei.util.QuestionHandler;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class QuestionController {

    private LessonRepository lessonRepository;

    private QuestionHandler questionHandler;

    private UserLessonRepository userLessonRepository;

    @Value("${gakusei.questions-quantity}")
    private int quantity;

    @Autowired
    public QuestionController(LessonRepository lessonRepository, QuestionHandler questionHandler, UserLessonRepository userLessonRepository) {
        this.lessonRepository = lessonRepository;
        this.questionHandler = questionHandler;
        this.userLessonRepository = userLessonRepository;
    }

    @RequestMapping(
            value = "/api/questions",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    ResponseEntity<List<HashMap<String, Object>>> getQuestionsFromLesson(
            @RequestParam(value = "lessonName") String lessonName,
            @RequestParam(value = "lessonType", defaultValue = "vocabulary") String lessonType,
            @RequestParam(name = "questionType", defaultValue = "reading") String questionType,
            @RequestParam(name = "answerType", defaultValue = "swedish") String answerType,
            @RequestParam(name = "username") String username,
            @RequestParam(name = "spacedRepetition", required = false, defaultValue = "false") boolean spacedRepetition) {

        List<HashMap<String, Object>> questions;
        if (!lessonName.equals("Favoriter")) {
            questions = getCachedQuestionsFromLesson(lessonName, lessonType,
                    questionType, answerType, username, spacedRepetition);
        } else {
            questions = getCachedQuestionsFromFavoriteLesson(lessonType, questionType, answerType, username);
        }

        return questions.isEmpty() ?
                new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR) :
                new ResponseEntity<>(questions, HttpStatus.OK);
    }

    private List<HashMap<String, Object>> getCachedQuestionsFromFavoriteLesson(
            String lessonType, String questionType, String answerType, String username) {
        //get all favorites, for each get unanswered and hard ones

        List<Nugget> allLessonNuggets;
        List<Lesson> favoriteLessons = userLessonRepository.findUsersStarredLessons(username)
                .stream().map(UserLesson::getLesson).collect(Collectors.toList());

        List<Nugget> unansweredNuggets = favoriteLessons.stream()
                .map(lesson -> lessonRepository.findUnansweredNuggets(username, lesson.getName()))
                .flatMap(List::stream)
                .collect(Collectors.toList());

        List<Nugget> nuggetsWithLowSuccessrate = favoriteLessons.stream()
                .map(lesson -> lessonRepository.findNuggetsBySuccessrate(username, lesson.getName()))
                .flatMap(List::stream)
                .collect(Collectors.toList());

        if (!lessonType.equals("grammar")) {
            allLessonNuggets = favoriteLessons.stream()
                    .map(lesson -> cachedFindNuggets(lesson.getName()))
                    .flatMap(List::stream)
                    .collect(Collectors.toList());
        } else {
            allLessonNuggets = favoriteLessons.stream()
                    .map(lesson -> cachedFindVerbNuggets(lesson.getName()))
                    .flatMap(List::stream)
                    .collect(Collectors.toList());
        }

        List<Nugget> favoriteNuggets = questionHandler.chooseNuggets(null, nuggetsWithLowSuccessrate,
                unansweredNuggets, allLessonNuggets, quantity, false);

        if (lessonType.equals("grammar")) {
            return questionHandler.createGrammarQuestions(
                    lessonRepository.findByName(null),
                    favoriteNuggets,
                    questionType,
                    answerType);
            //TODO: Fix favorite-mode for grammar questions.
        } else {
            return questionHandler.createQuestions(favoriteNuggets, questionType, answerType);
        }

    }

    private List<HashMap<String, Object>> getCachedQuestionsFromLesson(String lessonName, String lessonType, String
            questionType, String answerType, String username, boolean spacedRepetition) {

        List<Nugget> nuggetsWithLowSuccessrate = lessonRepository.findNuggetsBySuccessrate(username, lessonName);
        List<Nugget> unansweredNuggets = lessonRepository.findUnansweredNuggets(username, lessonName);
        List<Nugget> retentionNuggets = lessonRepository.findNuggetsByRetentionDate(username, lessonName);
        List<Nugget> allLessonNuggets;

        if (lessonType.equals("grammar")) {
            allLessonNuggets = cachedFindVerbNuggets(lessonName);
        } else {
            allLessonNuggets = cachedFindNuggets(lessonName);
        }

        List<Nugget> nuggets = questionHandler.chooseNuggets(retentionNuggets, nuggetsWithLowSuccessrate,
                unansweredNuggets, allLessonNuggets, quantity, spacedRepetition);

        if (lessonType.equals("grammar")) {
            return questionHandler.createGrammarQuestions(
                    lessonRepository.findByName(lessonName),
                    nuggets,
                    questionType,
                    answerType);
        } else {
            return questionHandler.createQuestions(nuggets, questionType, answerType);
        }
    }

    @Cacheable("otherNuggets")
    public List<Nugget> cachedFindNuggets(String lessonName) {
        return lessonRepository.findByName(lessonName).getNuggets();
    }

    @Cacheable("verbNuggets")
    public List<Nugget> cachedFindVerbNuggets(String lessonName) {
        return lessonRepository.findVerbNuggets(lessonRepository.findByName(lessonName).getId());
    }
}
