package se.kits.gakusei.content.model;

import java.io.Serializable;

import javax.persistence.*;

@Entity
@Table(name = "quiz_nugget", schema = "contentschema")
public class QuizNugget implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private long id;

    @Column(nullable = false)
    private String question;

    private String correctAnswer;

    @JoinColumn(name = "quiz_ref")
    @ManyToOne
    private Quiz quiz;

    public QuizNugget() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

}

