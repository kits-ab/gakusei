import React from 'react';
import ReactDOM from 'react-dom';
import {Navbar, Nav, NavItem, NavbarBrand, NavDropdown, Button, ButtonToolbar, Grid, Row, Col, FormGroup, DropdownButton, Checkbox, MenuItem, ButtonGroup, FormControl, ControlLabel, Collapse} from 'react-bootstrap';
import 'whatwg-fetch';

class GakuseiNav extends React.Component {
    constructor(props) {
        super(props);
    }
    eventHandler(eventKey){
        if (eventKey === 1.1) {
            this.props.updater('GuessPlayPage')
        } else if (eventKey === 1.2) {
            this.props.updater('TranslationPlayPage')
        } else if (eventKey === 2) {
            this.props.updater('NuggetListPage');
        } else if (eventKey === 3) {
            this.props.updater('AboutPage');
        }
    }
    render() {
        return (
            <Navbar onSelect={this.eventHandler.bind(this)} inverse collapseOnSelect>
                <Navbar.Header>
                    <NavbarBrand>
                        <span><a href="#"><img height={'100%'}
                                               src="/img/temp_gakusei_logo3.png"
                                               alt="Gakusei logo"/></a>Gakusei</span>
                    </NavbarBrand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                    <NavDropdown eventKey={1} title="Play" id="basic-nav-dropdown">
                        <MenuItem eventKey={1.1}>Guess the word</MenuItem>
                        <MenuItem eventKey={1.2}>Translation exercise</MenuItem>
                    </NavDropdown>
                    <NavItem eventKey={2} href="#">List Nuggets</NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={3} href="#">About</NavItem>
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

class GuessPlayPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {question: '',
            correctAlt: '',
            randomOrderAlt: ['', '', '', ''],
            buttonStyles: ['default', 'default', 'default', 'default'],
            buttonDisabled: false
        };
        this.fetchQuestion = this.fetchQuestion.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.getSuccessRate = this.getSuccessRate.bind(this);
    }
    fetchQuestion() {
        fetch('/api/question/', {credentials: "same-origin"})
            .then(response => response.json())
            .then(json =>
                this.setState({ question: json.question,
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
        if (answer === this.state.correctAlt) {
            newButtonStyles = this.state.randomOrderAlt.map( (word) => (word === answer) ? 'success' : 'default');
            if(sessionStorage.correctAttempts){
                sessionStorage.correctAttempts = Number(sessionStorage.correctAttempts) + 1;
            }
        } else {
            newButtonStyles = this.state.randomOrderAlt.map( (word) => {
                if (word === answer) {
                    return "danger";
                } else if(word === this.state.correctAlt) {
                    return "success";
                } else {
                    return "default";
                }
            });
        }

        if(sessionStorage.totalAttempts){
            sessionStorage.totalAttempts = Number(sessionStorage.totalAttempts) + 1;
        }

        this.setState({
            buttonDisabled: true,
            buttonStyles: newButtonStyles
        });
    }
    componentDidMount() {
        this.fetchQuestion();
        window.addEventListener("keydown", this.onKeys.bind(this));
        sessionStorage.setItem('correctAttempts', 0);
        sessionStorage.totalAttempts = 0;
    }
    getSuccessRate(){
        var successRate = 0;
        var successRateMessage = "";
        if(Number(sessionStorage.totalAttempts) > 0){
            successRate = Number(sessionStorage.correctAttempts)
                / Number(sessionStorage.totalAttempts) * 100;
            successRateMessage = successRate.toFixed(1) + " % success rate";
            if(successRate >= 80){
                return successRateMessage + " :D";
            } else if(successRate < 80 && successRate >= 60){
                return successRateMessage + " :)";
            } else if(successRate < 60 && successRate >= 40){
                return successRateMessage + " :/";
            } else if(successRate < 40 && successRate >= 20){
                return successRateMessage + " :(";
            } else if(successRate < 20){
                return successRateMessage + " :((";
            }
        }
    }
    onKeys(event){
        var keyDown = event.key;
        if (keyDown === 'Enter') {
            this.fetchQuestion();
        } else if (keyDown === '1' && !this.state.buttonDisabled) {
            this.checkAnswer(this.state.randomOrderAlt[0]);
        } else if (keyDown === '2' && !this.state.buttonDisabled) {
            this.checkAnswer(this.state.randomOrderAlt[1]);
        } else if (keyDown === '3' && !this.state.buttonDisabled) {
            this.checkAnswer(this.state.randomOrderAlt[2]);
        } else if (keyDown === '4' && !this.state.buttonDisabled) {
            this.checkAnswer(this.state.randomOrderAlt[3]);
        }
    }
    render() {
        return (
            <div>
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
                        <div className="text-center">
                            <Button bsStyle="info"  onClick={this.fetchQuestion}>
                                Next Question (Enter)
                            </Button>
                        </div>
                    </Row>
                    <Row>
                        <div className="text-center">
                            <br/>
                            {sessionStorage.correctAttempts + " correct attempts this session"}
                            <br/>
                            {sessionStorage.totalAttempts + " total attempts this session"}
                            <br/>
                            {this.getSuccessRate()}
                        </div>
                    </Row>
                    <br/>
                </Grid>
            </div>
        );
    }
}

class AboutPage extends React.Component {
    render() {
        return (
            <div>
                <br/>
                <div className="text-center">About page placeholder</div>
            </div>
        );
    }
}

class TranslationPlayPage extends React.Component {
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
        fetch('/api/question/', {credentials: "same-origin"})
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
        if (this.state.answer === this.state.correctAlt) {
            this.setState({output: 'Correct!'})
        } else {
            this.setState({output: `Wrong! Correct answer is: ${this.state.correctAlt}`})
        }
    }
    render() {
        return (
            <div>
                <Grid className="text-center">
                    <Row><h2>{this.state.question}</h2></Row>
                    <br/>
                    <Row>
                        <input value={this.state.answer} onChange={this.handleChange} placeholder='Enter answer here'/>
                    </Row>
                    <br/>
                    <Button type="submit" onClick={this.checkAnswer}>Check Answer</Button>
                    {'  '}
                    <Button bsStyle="info" onClick={this.fetchQuestion}> Next Question</Button>
                    <br/>
                    <Row><h3>{this.state.output}</h3></Row>
                </Grid>
            </div>
        );
    }
}

class NuggetListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {wordType: '',
            factType1: '',
            factType2: '',
            factType3: '',
            factType4: '',
            nuggetList: []
        };
        this.updateQueryInput = this.updateQueryInput.bind(this);
        this.fetchCustomQuery = this.fetchCustomQuery.bind(this);
    }
    updateQueryInput(event){
        if (event.target.id === 'kanjiFactType'){
            this.setState({
                factType1: event.target.checked ? 'kanji' : ''
            });
        } else if (event.target.id === 'readingFactType') {
            this.setState({
                factType2: event.target.checked ? 'reading' : ''
            });
        } else if (event.target.id === 'writingFactType') {
            this.setState({
                factType3: event.target.checked ? 'writing' : ''
            });
        } else if (event.target.id === 'englishFactType') {
            this.setState({
                factType4: event.target.checked ? 'english_translation' : ''
            });
        } else if (event.target.id === 'wordType') {
            this.setState({wordType: event.target.value});
        }
    }
    fetchCustomQuery(event){
        var fetchUrl = '/api/filter/nuggets?wordType=' + this.state.wordType
            + '&factType1=' + this.state.factType1
            + '&factType2=' + this.state.factType2
            + '&factType3=' + this.state.factType3
            + '&factType4=' + this.state.factType4;
        fetch(fetchUrl,
            {credentials: "same-origin"})
            .then(response => response.json())
            .then(json =>
                this.setState({
                    nuggetList: json
            }))
            .catch(ex => console.log('json parsing failed', ex));
            event.preventDefault();
    }
    render() {
        return(
            <div>
                <QueryInput handleChange={this.updateQueryInput}
                    handleSubmit={this.fetchCustomQuery}/>
                <br/>
                <NuggetList nuggetResults={this.state.nuggetList} />
            </div>
        )
    }
}

class QueryInput extends React.Component{
    render() {
        return(
            <form href="#" onSubmit={this.props.handleSubmit}>
                <FormGroup>
                    <ControlLabel>Filter nuggets on:</ControlLabel>
                    <FormControl componentClass="select" id="wordType"
                    onChange={this.props.handleChange}>
                        <option value=''>
                            All word types
                        </option>
                        <option value='verb'>
                            Verb
                        </option>
                        <option value='adjective'>
                            Adjective
                        </option>
                        <option value='noun'>
                            Noun
                        </option>
                        <option value='adverb'>
                            Adverb
                        </option>
                    </FormControl>
                    The nugget should contain the following translations:
                    <br/>
                    <Checkbox id="kanjiFactType" inline onChange={this.props.handleChange}>
                        Kanji
                    </Checkbox>
                    {' '}
                    <Checkbox id="readingFactType" inline onChange={this.props.handleChange}>
                        Japanese reading
                    </Checkbox>
                    {' '}
                    <Checkbox  id="writingFactType" inline onChange={this.props.handleChange}>
                        Japanese writing
                    </Checkbox>
                    {' '}
                    <Checkbox id="englishFactType" inline onChange={this.props.handleChange}>
                        English translation
                    </Checkbox>
                </FormGroup>
                <Button type="submit">
                    List Nuggets
                </Button>
            </form>
        )
    }
}

class NuggetList extends React.Component {
    render() {
        const listRows = this.props.nuggetResults.map( (nugget) =>
             <li key={nugget.id}>
                 {"type: " + nugget.type
                 + " // description: " + nugget.description}
                 <FactList factlist={nugget.facts}/>
             </li>
         );
        return(
            <div>
                <ul>{listRows}</ul>
            </div>
        )
    }
}

class FactList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render(){
        const factListRows = this.props.factlist.map( (fact) =>
            <li key={fact.id} > {"data: " + fact.data
            + " // type: " + fact.type
            + " // description: " + fact.description}
            </li>
        );
        return(
            <div>
                <Button bsSize="xsmall"
                onClick={ ()=> this.setState({ open: !this.state.open })}>
                    +
                </Button><br/>
                <Collapse in={this.state.open}>
                    <div>
                        <ul>{factListRows}</ul>
                    </div>
                </Collapse>
            </div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage : <GuessPlayPage/>,
        }
    }
    switchPage(newContent) {
        if (newContent === 'GuessPlayPage') {
            this.setState({currentPage : <GuessPlayPage/>})
        }
        else if (newContent === 'TranslationPlayPage') {
            this.setState({currentPage : <TranslationPlayPage/>})
        }
        else if (newContent === 'NuggetListPage') {
            this.setState({currentPage : <NuggetListPage/>})
        }
        else if (newContent === 'AboutPage') {
            this.setState({currentPage : <AboutPage/>})
        }
    }
    render() {
        return (
            <div>
                <GakuseiNav updater={this.switchPage.bind(this)} />
                {this.state.currentPage}
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('index_root'));