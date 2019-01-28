package se.kits.gakusei.content.model;

import java.io.Serializable;

import javax.persistence.*;

@Entity
@Table(name = "incorrect_quiz_answers", schema = "contentschema")
public class IncorrectAnswer implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private long id;

    @Column(nullable = false)
    private String incorrectAnswer;

    @JoinColumn(name = "quiz_nugget_ref")
    @ManyToOne
    private QuizNugget quizNugget;

    public IncorrectAnswer() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getIncorrectAnswer() {
        return incorrectAnswer;
    }

    public void setIncorrectAnswer(String incorrectAnswer) {
        this.incorrectAnswer = incorrectAnswer;
    }

    public QuizNugget getQuizNugget() {
        return quizNugget;
    }

    public void setQuizNugget(QuizNugget quizNugget) {
        this.quizNugget = quizNugget;
    }

}

