import React from 'react';
import ReactDOM from 'react-dom';
import {Navbar, Nav, NavItem, NavbarBrand, Button, ButtonToolbar, Grid, Row, Col} from 'react-bootstrap';
import 'whatwg-fetch';

class GakuseiNav extends React.Component {
    render() {
        return (
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <NavbarBrand>
                        <span><a href="#"><img height={'100%'}
                                               src="/img/temp_gakusei_logo3.png"
                                               alt="Gakusei logo"/></a>Gakusei</span>
                    </NavbarBrand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    {/*<Nav>*/}
                    {/*<NavItem eventKey={1} href="#">Link</NavItem>*/}
                    {/*<NavItem eventKey={2} href="#">Link</NavItem>*/}
                    {/*<NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">*/}
                    {/*<MenuItem eventKey={3.1}>Action</MenuItem>*/}
                    {/*<MenuItem eventKey={3.2}>Another action</MenuItem>*/}
                    {/*<MenuItem eventKey={3.3}>Something else here</MenuItem>*/}
                    {/*<MenuItem divider />*/}
                    {/*<MenuItem eventKey={3.3}>Separated link</MenuItem>*/}
                    {/*</NavDropdown>*/}
                    {/*</Nav>*/}
                    <Nav pullRight>
                        <NavItem eventKey={2} href="#">About</NavItem>
                        <Navbar.Text>
                            <Navbar.Link href="/logout">Logout</Navbar.Link>
                        </Navbar.Text>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

class AnswerButton extends React.Component {
    render() {
        return (
            <Button bsStyle="default"
                                   bsSize="large" block
                                   onClick={this.props.onAnswerClick.bind(this, this.props.label)}>
                {this.props.label}
            </Button>
        );
    }
}

class NextButton extends React.Component {
    render() {
        return(
            <Button bsStyle="info"
                                   onClick={this.props.onMagicClick}>
                Next Question
            </Button>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {question: '',
            answerReturn: '',
            correctAlt: '',
            randomOrderAlt: ['', '', '', '']
        };
        this.fetchQuestion = this.fetchQuestion.bind(this);
        this.postAnswer = this.postAnswer.bind(this);
    }

    fetchQuestion() {
        fetch('/api/question/', {credentials: "same-origin"})
            .then(response => response.json())
            .then(json =>
                this.setState({ answerReturn: '',
                                question: json.question,
                                correctAlt: json.correctAlternative,
                                randomOrderAlt: this.randomizeOrder([json.alternative1,
                                                                     json.alternative2,
                                                                     json.alternative3,
                                                                     json.correctAlternative])
                                })
            ).catch(ex => console.log('json parsing failed', ex))
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

    postAnswer(answer) {
        this.setState({
            answerReturn: (answer === this.state.correctAlt) ? "Correct!" : "Incorrect"
        });
    }

    componentDidMount() {
        this.fetchQuestion();
    }

    render() {
        return (
            <div>
                <GakuseiNav/>
                <Grid>
                    <Row><h2 className="text-center">{this.state.question}</h2></Row>
                    <br/>
                    <Row>
                        <ButtonToolbar>
                            <Col xs={5} xsOffset={1} sm={4} smOffset={2} md={3} mdOffset={3}>
                                <AnswerButton label = {this.state.randomOrderAlt[0]} onAnswerClick={this.postAnswer}/>
                            </Col>
                            <Col xs={5} sm={4} md={3}>
                                <AnswerButton label = {this.state.randomOrderAlt[1]} onAnswerClick={this.postAnswer}/>
                            </Col>
                        </ButtonToolbar>
                    </Row>
                    <br/>
                    <Row>
                        <ButtonToolbar>
                            <Col xs={5} xsOffset={1} sm={4} smOffset={2} md={3} mdOffset={3}>
                                <AnswerButton label = {this.state.randomOrderAlt[2]} onAnswerClick={this.postAnswer}/>
                            </Col>
                            <Col xs={5} sm={4} md={3}>
                                <AnswerButton label = {this.state.randomOrderAlt[3]} onAnswerClick={this.postAnswer}/>
                            </Col>
                        </ButtonToolbar>
                    </Row>
                    <br/><br/>
                    <Row>
                        <div className="text-center"><NextButton onMagicClick={this.fetchQuestion}/></div>
                    </Row>
                    <br/>
                    <Row>
                        <div className="text-center">{this.state.answerReturn}</div>
                    </Row>
                </Grid>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('index_root'));