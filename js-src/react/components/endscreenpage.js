import React from 'react';
import {Button, Grid, Row} from 'react-bootstrap';

export default class EndScreenPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {successRate: 0};
    }
    componentDidMount(){
        this.setState({
            successRate: Number(sessionStorage.correctAttempts) / Number(sessionStorage.totalAttempts) * 100
        });
    }
    componentWillUnmount(){
        sessionStorage.removeItem('correctAttempts');
        sessionStorage.removeItem('totalAttempts');
    }
    render(){
        return(
            <Grid>
                <Row>
                    <div className="text-center">
                        <h2>
                        {sessionStorage.correctAttempts + " rätt (" +
                        this.state.successRate.toFixed(0) + " %)"}
                        </h2>
                    </div>
                </Row>
                <Row>
                    <div className="text-center">
                        <Button bsStyle="info" onClick={() =>
                        this.props.switchPage('GuessPlayPage')}>
                            Samma frågor igen
                        </Button>
                        {' '}
                        <Button bsStyle="info" onClick={() =>
                        this.props.switchPage('GuessPlayPageSelection')}>
                            Nya frågor
                        </Button>
                    </div>
                </Row>
            </Grid>
        );
    }
}