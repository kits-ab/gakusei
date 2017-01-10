import React from 'react';
import {Button, ButtonToolbar, Grid, Row, Col} from 'react-bootstrap';
import 'whatwg-fetch';
import AnswerButton from './answerbutton';

export default class GuessPlayPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {question: '',
            correctAlt: '',
            randomOrderAlt: ['', '', '', ''],
            buttonStyles: ['default', 'default', 'default', 'default'],
            buttonDisabled: false,
            lesson: [],
            currentQuestion: ''
        };
        this.setQuestion = this.setQuestion.bind(this);
        this.getNextQuestion = this.getNextQuestion.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.getSuccessRate = this.getSuccessRate.bind(this);
        this.onKeys = this.onKeys.bind(this);

        sessionStorage.setItem('correctAttempts', 0);
        sessionStorage.totalAttempts = 0;
        sessionStorage.currentQuestionIndex = 0;

    }
    componentDidMount() {
        window.addEventListener("keydown", this.onKeys);
        this.setState({
            lessonLength: JSON.parse(sessionStorage.lesson).length
        });
        this.setQuestion(0);
    }
    componentWillUnmount() {
        window.clearInterval(this.countDownVisible);
        window.removeEventListener("keydown", this.onKeys);
        sessionStorage.removeItem('currentQuestionIndex');

    }
    setQuestion(questionIndex) {
        this.setState({
            question: JSON.parse(sessionStorage.lesson)[questionIndex].question,
            correctAlt: JSON.parse(sessionStorage.lesson)[questionIndex].correctAlternative,
            randomOrderAlt: this.randomizeOrder([
                JSON.parse(sessionStorage.lesson)[questionIndex].alternative1,
                JSON.parse(sessionStorage.lesson)[questionIndex].alternative2,
                JSON.parse(sessionStorage.lesson)[questionIndex].alternative3,
                JSON.parse(sessionStorage.lesson)[questionIndex].correctAlternative]),
            buttonStyles: ['default', 'default', 'default', 'default'],
            buttonDisabled: false
        });
    }
    getNextQuestion(){
        if(Number(sessionStorage.currentQuestionIndex) + 1 < this.state.lessonLength){
            sessionStorage.currentQuestionIndex = Number(sessionStorage.currentQuestionIndex) + 1;
            this.setQuestion(Number(sessionStorage.currentQuestionIndex));
        } else {
            this.setState({
                buttonDisabled: true
            });
        }
    }
    randomizeOrder(array) {
        let i = array.length - 1;
        for (; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        };
        return array;
    }
    checkAnswer(answer) {
        let newButtonStyles = [];
        if (answer === this.state.correctAlt) {
            newButtonStyles = this.state.randomOrderAlt.map( (word) => (word === answer) ?
            'success' : 'default');
            sessionStorage.correctAttempts = Number(sessionStorage.correctAttempts) + 1;
        } else {
            newButtonStyles = this.state.randomOrderAlt.map( (word) => {
                if (word === answer) {
                    return 'danger';
                } else if(word === this.state.correctAlt) {
                    return 'success';
                } else {
                    return 'default';
                }
            });
        }
        sessionStorage.totalAttempts = Number(sessionStorage.totalAttempts) + 1;
        this.setState({
            buttonDisabled: true,
            buttonStyles: newButtonStyles
        });

        if(Number(sessionStorage.currentQuestionIndex) < this.state.lessonLength - 1){
            setTimeout(() => {
                this.getNextQuestion();
            }, 1000);
        } else {
            setTimeout(() => this.props.switchPage('EndScreenPage'), 1000);
        }
    }
    getSuccessRate(){
        let successRate = 0;
        let successRateMessage = '';
        const emojiFeedback = {
            veryBad : String.fromCodePoint(0x1F61E),
            bad : String.fromCodePoint(0x1F615),
            average : String.fromCodePoint(0x1F610),
            good : String.fromCodePoint(0x1F642),
            veryGood : String.fromCodePoint(0x1F600)
        };
        if (Number(sessionStorage.totalAttempts) > 0) {
            successRate = Number(sessionStorage.correctAttempts)
                / Number(sessionStorage.totalAttempts) * 100;
            successRateMessage = `${successRate.toFixed(0)} %`;
            if(successRate >= 80){
                return `, ${successRateMessage} ${emojiFeedback['veryGood']}`;
            } else if(successRate < 80 && successRate >= 60){
                return `, ${successRateMessage} ${emojiFeedback['good']}`;
            } else if(successRate < 60 && successRate >= 40){
                return `, ${successRateMessage} ${emojiFeedback['average']}`;
            } else if(successRate < 40 && successRate >= 20){
                return `, ${successRateMessage} ${emojiFeedback['bad']}`;
            } else if(successRate < 20){
                return `, ${successRateMessage} ${emojiFeedback['veryBad']}`;
            }
        } else {
              return successRateMessage;
        }
    }
    onKeys(event){
        let keyDown = event.key;
        if(!this.state.buttonDisabled){
            if (keyDown === '1') {
                this.checkAnswer(this.state.randomOrderAlt[0]);
            } else if (keyDown === '2') {
                this.checkAnswer(this.state.randomOrderAlt[1]);
            } else if (keyDown === '3') {
                this.checkAnswer(this.state.randomOrderAlt[2]);
            } else if (keyDown === '4') {
                this.checkAnswer(this.state.randomOrderAlt[3]);
            }
        }

    }
    render() {
        return (
            <div>
                <Grid>
                    <Row><h2 className='text-center'>{this.state.question}</h2></Row>
                    <br/>
                    <Row>
                        <ButtonToolbar>
                            <Col xs={6} sm={4} smOffset={2} md={3} mdOffset={3}>
                                <AnswerButton label = {this.state.randomOrderAlt[0]}
                                    onAnswerClick={this.checkAnswer}
                                    buttonStyle = {this.state.buttonStyles[0]}
                                    disableButton = {this.state.buttonDisabled} />
                            </Col>
                            <Col xs={6} sm={4} md={3}>
                                <AnswerButton label = {this.state.randomOrderAlt[1]}
                                    onAnswerClick={this.checkAnswer}
                                    buttonStyle = {this.state.buttonStyles[1]}
                                    disableButton = {this.state.buttonDisabled} />
                            </Col>
                        </ButtonToolbar>
                    </Row>
                    <br/>
                    <Row>
                        <ButtonToolbar>
                            <Col xs={6} sm={4} smOffset={2} md={3} mdOffset={3}>
                                <AnswerButton label = {this.state.randomOrderAlt[2]}
                                    onAnswerClick={this.checkAnswer}
                                    buttonStyle = {this.state.buttonStyles[2]}
                                    disableButton = {this.state.buttonDisabled} />
                            </Col>
                            <Col xs={6} sm={4} md={3}>
                                <AnswerButton label = {this.state.randomOrderAlt[3]}
                                    onAnswerClick = {this.checkAnswer}
                                    buttonStyle = {this.state.buttonStyles[3]}
                                    disableButton = {this.state.buttonDisabled} />
                            </Col>
                        </ButtonToolbar>
                    </Row>
                    <br/><br/>
                    <Row>
                        <div className="text-center">
                            Fråga: {(Number(sessionStorage.currentQuestionIndex) + 1) + ' / '
                            + this.state.lessonLength}
                            <br/>
                            {sessionStorage.correctAttempts + ' rätt' + this.getSuccessRate()}
                        </div>
                    </Row>
                    <Row>
                        <div className="text-center">
                            <Button bsStyle="info" onClick={() =>
                            this.props.switchPage('GuessPlayPageSelection')}>
                                Ny spelomgång
                            </Button>
                        </div>
                    </Row>
                    <br/>
                </Grid>
            </div>
        );
    }
}