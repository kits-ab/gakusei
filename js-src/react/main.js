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
            <Button bsStyle={this.props.buttonStyle}
               bsSize="large" block
               onClick={this.props.onAnswerClick.bind(this, this.props.label)}
               disabled = {this.props.disableButton}>
               {this.props.buttonNumber + ". " + this.props.label}
            </Button>
        );
    }
}

class NextButton extends React.Component {
    render() {
        return(
            <Button bsStyle="info" onClick={this.props.onMagicClick}>
                Next Question (Enter)
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
            randomOrderAlt: ['', '', '', ''],
            buttonStyles: ['default', 'default', 'default', 'default'],
            buttonDisabled: false
        };
        this.fetchQuestion = this.fetchQuestion.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
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
                                                                     json.correctAlternative]),
                                buttonStyles: ['default', 'default', 'default', 'default'],
                                buttonDisabled: false
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

    checkAnswer(answer) {
        var newButtonStyles = [];
        if(answer === this.state.correctAlt){
            newButtonStyles = this.state.randomOrderAlt.map( (word) => (word === answer) ? 'success' : 'default');
        }else{
            newButtonStyles = this.state.randomOrderAlt.map( (word) => {
                if(word === answer){
                    return "danger";
                }else if(word === this.state.correctAlt){
                    return "success";
                }else{
                    return "default";
                }
            });
        }

        this.setState({
            buttonDisabled: true,
            buttonStyles: newButtonStyles
        });
    }

    componentDidMount() {
        this.fetchQuestion();
        window.addEventListener("keydown", this.onKeys.bind(this));
    }

    onKeys(event){
        var keyDown = event.key;
        if(keyDown === 'Enter'){
            this.fetchQuestion();
        }else if(keyDown === '1' && !this.state.buttonDisabled){
            this.checkAnswer(this.state.randomOrderAlt[0]);
        }else if(keyDown === '2' && !this.state.buttonDisabled){
            this.checkAnswer(this.state.randomOrderAlt[1]);
        }else if(keyDown === '3' && !this.state.buttonDisabled){
            this.checkAnswer(this.state.randomOrderAlt[2]);
        }else if(keyDown === '4' && !this.state.buttonDisabled){
            this.checkAnswer(this.state.randomOrderAlt[3]);
        }
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
                                <AnswerButton label = {this.state.randomOrderAlt[0]}
                                    buttonNumber = {1}
                                    onAnswerClick={this.checkAnswer}
                                    buttonStyle = {this.state.buttonStyles[0]}
                                    disableButton = {this.state.buttonDisabled} />
                            </Col>
                            <Col xs={5} sm={4} md={3}>
                                <AnswerButton label = {this.state.randomOrderAlt[1]}
                                    buttonNumber = {2}
                                    onAnswerClick={this.checkAnswer}
                                    buttonStyle = {this.state.buttonStyles[1]}
                                    disableButton = {this.state.buttonDisabled} />
                            </Col>
                        </ButtonToolbar>
                    </Row>
                    <br/>
                    <Row>
                        <ButtonToolbar>
                            <Col xs={5} xsOffset={1} sm={4} smOffset={2} md={3} mdOffset={3}>
                                <AnswerButton label = {this.state.randomOrderAlt[2]}
                                    buttonNumber = {3}
                                    onAnswerClick={this.checkAnswer}
                                    buttonStyle = {this.state.buttonStyles[2]}
                                    disableButton = {this.state.buttonDisabled} />
                            </Col>
                            <Col xs={5} sm={4} md={3}>
                                <AnswerButton label = {this.state.randomOrderAlt[3]}
                                    buttonNumber = {4}
                                    onAnswerClick = {this.checkAnswer}
                                    buttonStyle = {this.state.buttonStyles[3]}
                                    disableButton = {this.state.buttonDisabled} />
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