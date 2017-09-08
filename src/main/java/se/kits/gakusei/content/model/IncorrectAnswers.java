package se.kits.gakusei.content.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "incorrect_answers", schema = "contentschema")
public class IncorrectAnswers implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String incorrectAnswer;

    @ManyToOne( cascade = CascadeType.REMOVE )
    @JoinColumn(name="quiz_nugget_ref")
    private QuizNugget quizNugget;

    public IncorrectAnswers() {
    }

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
