import React from 'react';
import {Button, Grid, Row} from 'react-bootstrap';
import 'whatwg-fetch';

export default class TranslationPlayPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {answer: '',
                      output: '',
                      question: '',
                      correctAlt: ''}
        this.fetchQuestion = this.fetchQuestion.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.fetchQuestion();
    }
    fetchQuestion() {
        this.setState({answer: '',
                       output: ''});
        fetch('/api/question/', {credentials: 'same-origin'})
            .then(response => response.json())
            .then(json =>
                this.setState({ question: json.question,
                                correctAlt: json.correctAlternative })
            ).catch(ex => console.log('json parsing failed', ex))
    }
    handleChange(event) {
        this.setState({answer: event.target.value});
    }
    checkAnswer() {
        if (this.state.answer.trim().toUpperCase() === this.state.correctAlt.toUpperCase()) {
            this.setState({output: 'Rätt!'})
        } else {
            this.setState({output: `Fel! Det rätta svaret är: ${this.state.correctAlt}`})
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
                    <br/>
                    <Button type='submit' onClick={this.checkAnswer}>Kontrollera svar</Button>
                    {'  '}
                    <Button bsStyle='info' onClick={this.fetchQuestion}>Nästa ord</Button>
                    <br/>
                    <Row><h3>{this.state.output}</h3></Row>
                </Grid>
            </div>
        );
    }
}