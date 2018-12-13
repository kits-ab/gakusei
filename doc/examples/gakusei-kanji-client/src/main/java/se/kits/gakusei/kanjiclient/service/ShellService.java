package se.kits.gakusei.kanjiclient.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.shell.Availability;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;
import org.springframework.shell.standard.ShellOption;

@ShellComponent
public class ShellService {

    private boolean answerRequired = false;
    private String currentQuestion;

    public ShellService(){
    }

    @Autowired
    KanjiService kanjiService;

    /**
     * Gets a random question from the selected lesson and prints the question.
     *
     * @param lessonName Name of the lesson to get the question from.
     * */
    @ShellMethod(value = "Get a random question from the selected lesson.\n\t\t\t@Param Lesson name.", key = "get")
    public void getQuestion(@ShellOption String lessonName) {

        if(kanjiService.isLesson(lessonName)){
            currentQuestion = kanjiService.getQuestion(lessonName.replace('_', ' '));
            System.out.println(currentQuestion);
            System.out.println("\nDid you answer correctly? Provide an answer using the command 'answer' followed" +
                    " by 'yes', 'no' or 'vetej'.\nUse the command 'printSVG' to print the SVG for the question or " +
                    "'showSVG' to show the SVG in a browser.");
            answerRequired = true;
        }else{
            System.out.println("The specified lesson does not exist or is unavailable.\n");
        }
    }

    /**
     * Prints a list of all available lessons.
     */
    @ShellMethod(value = "Get a list of all available lessons.", key = "lessons")
    public void getAllLessons(){
        kanjiService.printLessons();
        System.out.println("\nUse the above list of available lessons to fetch questions with the " +
                "command 'get' followed by the name of lesson you want to fetch a random question from.\n" +
                "E.g. 'get " + kanjiService.lessons.get(0) + "'\n");
    }

    /**
     * Checks if the user's answer is valid and sends it to the gakusei application.
     *
     * @param answer The user's answer.
     */
    @ShellMethod(value = "Provide an answer to a question. \n\t\t\t@Param 'yes', 'no' or 'vetej'", key = "answer")
    public void answer(@ShellOption String answer){
        if(answer.equals("yes") || answer.equals("no") || answer.equals("vetej")){
            ResponseEntity responseEntity = kanjiService.sendAnswer(answer);
            if(responseEntity.getStatusCode().is2xxSuccessful()){
                System.out.println("Server response: " + responseEntity.getStatusCode());
                System.out.println("Answer submitted.\n");
            }else{
                System.out.println("Server response: " + responseEntity.getStatusCode());
                System.out.println("Something went wrong. Please try again.\n");
            }
            answerRequired = false;
        }else{
            System.out.println("Answer is not valid. Please answer with 'yes', 'no' or 'vetej'.\n");
        }
    }

    /**
     * Aborts the ongoing question.
     */
    @ShellMethod(value = "Aborts the ongoing question.", key = "abort")
    public void abort(){
        System.out.println("Question aborted.\n");
        answerRequired = false;
    }

    /**
     *Calls method showSVG() in kanjiService class.
     */
    @ShellMethod(value = "Show the kanji SVG in a browser.", key = "showSVG")
    public void showSVG(){
        kanjiService.showSVG();
    }

    /**
     *Calls method printSVG() in kanjiService class.
     */
    @ShellMethod(value = "Print the kanji SVG in the terminal.", key = "printSVG")
    public void printSVG(){
        kanjiService.printSVG();
    }

    /**
     * Checks the availability of the answer command.
     *
     * @return Returns true or false depending on the availability.
     */
    public Availability answerAvailability(){
        return answerRequired ? Availability.available()
                : Availability.unavailable("no question has been asked.");
    }

    /**
     * Checks the availability of the get command.
     *
     * @return Returns true or false depending on the availability.
     */
    public Availability getQuestionAvailability(){
        return answerRequired ?
                Availability.unavailable("a question has been asked. \nProvide an answer before proceeding " +
                        "or use the command 'abort' if you do not wish to answer.")
                : Availability.available();
    }

    /**
     * Checks the availability of the lessons command.
     *
     * @return Returns true or false depending on the availability.
     */
    public Availability getAllLessonsAvailability(){
        return answerRequired ?
                Availability.unavailable("a question has been asked. \nProvide an answer before proceeding " +
                        "or use the command 'abort' if you do not wish to answer.")
                : Availability.available();
    }

    /**
     * Checks the availability of the abort command.
     *
     * @return Returns true or false depending on the availability.
     */
    public Availability abortAvailability(){
        return answerRequired ? Availability.available()
                : Availability.unavailable("there is no question to abort.");
    }

    /**
     *Checks the availability of the printSVG command.
     *
     *@return Returns true or false depending on the availability.
     */
    public Availability printSVGAvailability(){
        return answerRequired ? Availability.available()
                : Availability.unavailable("there is no SVG available to print.");
    }

    /**
     *Checks the availability of the showSVG command.
     *
     *@return Returns true or false depending on the availability.
     */
    public Availability showSVGAvailability(){
        return answerRequired ? Availability.available()
                : Availability.unavailable("there is no SVG available to show.");
    }
}
