import React from 'react';
import {Button, Grid, Row, Col, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

export default class GuessPlaySelection extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedLesson: 'Verbs'
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    fetchLesson() {
        fetch('/api/questions?lessonName=' + this.state.selectedLesson, {credentials: "same-origin"})
            .then(response => response.json())
            .then(json => {
                sessionStorage.lesson = JSON.stringify(json);
                this.props.switchPage('GuessPlayPage', this.state.selectedLesson);
            }).catch(ex => console.log('Fel vid hämtning av spelomgång', ex));
    }
    handleChange(event){
        if (event.target.id === 'lessonSelection') {
            this.setState({selectedLesson: event.target.value});
        }
    }
    handleSubmit(event){
        event.preventDefault();
        this.fetchLesson();
    }
    render(){
        return(
            <div>
                <Grid>
                    <Row>
                        <Col xs={8} lg={3}>
                    <form href="#" onSubmit={this.handleSubmit}>

                                <FormGroup>
                                    <ControlLabel>Välj lista av frågor</ControlLabel>
                                    <FormControl componentClass="select" id="lessonSelection"
                                                 onChange={this.handleChange} value={this.state.selectedLesson}>
                                        <option value='Verbs'>
                                            Verb
                                        </option>
                                        <option value='Adjectives'>
                                            Adjektiv
                                        </option>
                                        <option value='Nouns'>
                                            Substantiv
                                        </option>
                                    </FormControl>
                                </FormGroup>

                        <Button type="submit">
                            Starta
                        </Button>
                    </form>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}