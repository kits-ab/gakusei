import React from 'react';
import {Button, Grid, Row} from 'react-bootstrap';
import 'whatwg-fetch';
import Utility from '../util/utility';

export default class TranslationPlayPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {answer: '',
                      output: '',
                      question: '',
                      correctAlt: '',
                      checkDisable: false,
                      results: []
                      };
        this.checkAnswer = this.checkAnswer.bind(this);
        this.handleChange = this.handleChange.bind(this);

        sessionStorage.correctAttempts = 0;
        sessionStorage.totalAttempts = 0;
        sessionStorage.currentQuestionIndex = 0;
    }
    componentDidMount() {
        this.setState({
            lessonLength: JSON.parse(sessionStorage.lesson).length
        });
        this.setQuestion(0);
    }
    componentWillUnmount(){
        sessionStorage.removeItem('currentQuestionIndex');
    }
    setQuestion(questionIndex) {
        this.setState({
            answer: '',
            output: '',
            question: JSON.parse(sessionStorage.lesson)[questionIndex].question,
            correctAlt: JSON.parse(sessionStorage.lesson)[questionIndex].correctAlternative,
            checkDisable: false
        });
    }
    getNextQuestion(){
        if(Number(sessionStorage.currentQuestionIndex) + 1 < this.state.lessonLength){
            sessionStorage.currentQuestionIndex = Number(sessionStorage.currentQuestionIndex) + 1;
            this.setQuestion(Number(sessionStorage.currentQuestionIndex));
        } else {
            this.props.switchPage('EndScreenPage', '', 'TranslationPlayPage');
        }
    }
    handleChange(event) {
        this.setState({answer: event.target.value});
    }
    checkAnswer() {
        if (this.state.answer.trim().toUpperCase() === this.state.correctAlt.toUpperCase()) {
            this.setState({output: 'Rätt!'});
            sessionStorage.correctAttempts = Number(sessionStorage.correctAttempts) + 1;
        } else {
            this.setState({output: `Fel! Det rätta svaret är: ${this.state.correctAlt}`})
        }
        this.setState({
            checkDisable: true
        });
        sessionStorage.totalAttempts = Number(sessionStorage.totalAttempts) + 1;
        this.setState({
            results: this.state.results.concat([[this.state.question, this.state.correctAlt, this.state.answer]])
        });
        if(Number(sessionStorage.currentQuestionIndex) < this.state.lessonLength - 1){
            setTimeout(() => {
                this.getNextQuestion();
            }, 2000);
        } else {
            setTimeout(() => this.props.switchPage('EndScreenPage', '', 'TranslationPlayPage', this.state.results), 2000);
        }
    }
    render() {
        return (
            <div>
                <Grid className='text-center'>
                    <Row><h2>{this.state.question}</h2></Row>
                    <br/>
                    <Row>
                        <input value={this.state.answer} onChange={this.handleChange} placeholder='Skriv in ditt svar här'/>
                    </Row>
                    <Row>
                        <Button type='submit' onClick={this.checkAnswer} disabled={this.state.checkDisable}>
                            Kontrollera svar
                        </Button>
                    </Row>
                    <Row>
                        <div className="text-center">
                            Fråga: {(Number(sessionStorage.currentQuestionIndex) + 1) + ' / '
                            + this.state.lessonLength}
                            <br/>
                            {sessionStorage.correctAttempts + ' rätt' + Utility.getSuccessRate()}
                        </div>
                    </Row>
                    <Row><h3>{this.state.output}</h3></Row>
                </Grid>
            </div>
        );
    }
}