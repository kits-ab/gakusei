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

    handleChange(event){
        if (event.target.id === 'lessonSelection') {
            this.setState({selectedLesson: event.target.value});
        }
    }
    handleSubmit(event){
        this.props.switchPage('GuessPlayPage', this.state.selectedLesson);
        event.preventDefault();
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