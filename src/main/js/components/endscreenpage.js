import React from 'react';
import {Button, Grid, Row, ListGroup, ListGroupItem} from 'react-bootstrap';

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
        const results = this.props.results.map(result =>
            <ListGroupItem key={result[0], result[1]} bsStyle={(result[1] === result[2]) ? 'success' : 'danger'}>
                {`Fråga: ${result[0]}, Korrekt svar: ${result[1]}, Ditt svar: ${result[2]}`}
            </ListGroupItem>
        );
        return(
            <Grid>
                <Row>
                    <div className="text-center">
                        <h2>
                            {this.state.successRate.toFixed(0)}% rätt!
                        </h2>
                        <h3>
                            Du svarade rätt på {sessionStorage.correctAttempts} av {sessionStorage.totalAttempts} möjliga frågor
                        </h3>
                    </div>
                </Row>
                <ListGroup>
                    <ListGroupItem>
                        {results}
                    </ListGroupItem>
                </ListGroup>
                <Row>
                    <div className="text-center">
                        <Button bsStyle="info"
                                onClick={() => this.props.switchPage(this.props.gamemode)}>
                            Försök igen
                        </Button>
                        {' '}
                        <Button bsStyle="info"
                                onClick={() => this.props.switchPage('LessonSelection', '', this.props.gamemode)}>
                            Välj nya frågor
                        </Button>
                    </div>
                </Row>
            </Grid>
        );
    }
}
