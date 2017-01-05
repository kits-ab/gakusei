import React from 'react';
import ReactDOM from 'react-dom';
import {Navbar, Nav, NavItem, NavbarBrand, NavDropdown, Button, ButtonToolbar, Grid, Row, Col, FormGroup,
        Checkbox, MenuItem, FormControl, ControlLabel, Collapse, ListGroup,
        ListGroupItem, Panel} from 'react-bootstrap';
import 'whatwg-fetch';
import xml2js from 'xml2js';

class GakuseiNav extends React.Component {
    constructor(props) {
        super(props);
    }
    eventHandler(eventKey){
        if (eventKey === 1.1) {
            this.props.updater('GuessPlayPageSelection')
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
                        <span><a href='#'><img height={'100%'}
                                               src='/img/temp_gakusei_logo3.png'
                                               alt='Gakusei logo'/></a>Gakusei</span>

                    </NavbarBrand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                    <NavDropdown eventKey={1} title='Spela' id='basic-nav-dropdown'>
                        <MenuItem eventKey={1.1}>Gissa ordet</MenuItem>
                        <MenuItem eventKey={1.2}>Översätt ordet</MenuItem>
                    </NavDropdown>
                    <NavItem eventKey={2} href='#'>Lista Nuggets</NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={3} href='#'>Om Gakusei</NavItem>
                        {/*<Navbar.Text>*/}
                            {/*<Navbar.Link href='/logout'>Logga ut</Navbar.Link>*/}
                        {/*</Navbar.Text>*/}
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
               bsSize='large' block
               onClick={this.props.onAnswerClick.bind(this, this.props.label)}
               disabled = {this.props.disableButton}
               className={'btn answerbutton'}>
               {this.props.buttonNumber + '. ' + this.props.label}
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
            buttonDisabled: false,
            lesson: [],
            currentQuestion: ''
        };
        this.setQuestion = this.setQuestion.bind(this);
        this.getNextQuestion = this.getNextQuestion.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.getSuccessRate = this.getSuccessRate.bind(this);
        this.fetchLesson = this.fetchLesson.bind(this);
        this.switchPage = this.switchPage.bind(this);
        this.onKeys = this.onKeys.bind(this);

        sessionStorage.setItem('correctAttempts', 0);
        sessionStorage.totalAttempts = 0;
        sessionStorage.currentQuestionIndex = 0;

    }
    componentDidMount() {
        window.addEventListener("keydown", this.onKeys);
        this.fetchLesson();
    }
    componentWillUnmount() {
        window.clearInterval(this.countDownVisible);
        window.removeEventListener("keydown", this.onKeys);
        sessionStorage.removeItem('correctAttempts');
        sessionStorage.removeItem('totalAttempts');
        sessionStorage.removeItem('currentQuestionIndex');

    }
    fetchLesson() {
        fetch('/api/questions?lessonName=' + this.props.selectedLesson, {credentials: "same-origin"})
            .then(response => response.json())
            .then(json => {
                sessionStorage.lesson = JSON.stringify(json);
                this.setState({
                    lessonLength: JSON.parse(sessionStorage.lesson).length
                });
                this.setQuestion(0);
            }).catch(ex => console.log('Fel vid hämtning av spelomgång', ex));
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
        var newButtonStyles = [];
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
        }
    }
    getSuccessRate(){
        var successRate = 0;
        var successRateMessage = "";
        if(Number(sessionStorage.totalAttempts) > 0){
            successRate = Number(sessionStorage.correctAttempts)
                / Number(sessionStorage.totalAttempts) * 100;
            successRateMessage = successRate.toFixed(0) + "% rätt";
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
    switchPage() {
        this.props.switchPage('GuessPlayPageSelection');
    }
    onKeys(event){
        var keyDown = event.key;
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
                            Fråga: {(Number(sessionStorage.currentQuestionIndex) + 1) + " / "
                            + this.state.lessonLength}
                            <br/>
                            {sessionStorage.correctAttempts + " rätt"}
                            <br/>
                            {sessionStorage.totalAttempts + " försök"}
                            <br/>
                            {this.getSuccessRate()}
                        </div>
                    </Row>
                    <Row>
                        <div className="text-center">
                            <Button bsStyle="info" onClick={this.switchPage}>
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

class AboutPage extends React.Component {
    render() {
        let xmldoc = '';
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                xmldoc = xmlhttp.response;
            }
        };
        xmlhttp.open('GET', 'license/licenses.xml', false);
        xmlhttp.send();

        let licenses = '';
        xml2js.parseString(xmldoc, function (err, result) {
            let dep = result.licenseSummary.dependencies[0].dependency;

            dep.forEach(d => {
                if (!d.licenses[0]['license']) {
                    d.licenses[0] = {
                        'license' : [{
                            'name' : ['No license specified'],
                            'url' : ['']
                        }]
                    };
                } else if (!d.licenses[0].license[0]['url']) {
                    d.licenses[0].license[0] = {
                        'name' : d.licenses[0].license[0].name[0],
                        'url' : ''
                    }
                }
            });

            const produceLicenses = licenses => licenses.map(
                l => <div key={l.url[0] + l.name[0]}><a target='_blank' href={l.url[0]}>{l.name[0]}</a></div>
            );

            licenses = dep.map(d =>
                <ListGroupItem key={d.groupId[0] + d.artifactId[0]}>
                    {'Modul: ' + d.groupId[0] + ' : ' + d.artifactId[0]} <br/>
                    {'Version: ' + d.version[0]} <br/>
                    {'Licens(er): '} {produceLicenses(d.licenses[0].license)}
                </ListGroupItem>);
        });

        const licenses_frontend = [{'name' : 'babel-preset-stage-2',
                                       'version' : '6.18.0',
                                       'license' : 'MIT'
                                   },
                                   {'name' : 'babel-preset-react',
                                    'version' : '6.16.0',
                                    'license' : 'MIT'
                                   },
                                   {'name' : 'babel-preset-es2015',
                                    'version' : '6.18.0',
                                    'license' : 'MIT'
                                   },
                                   {'name' : 'babelify',
                                    'version' : '7.2.0',
                                    'license' : 'MIT'
                                   },
                                   {'name' : 'whatwg-fetch',
                                    'version' : '2.0.1',
                                    'license' : 'MIT'
                                   },
                                   {'name' : 'react-dom',
                                    'version' : '15.4.1',
                                    'license' : 'BSD-3-Clause'
                                   },
                                   {'name' : 'react',
                                    'version' : '15.4.1',
                                    'license' : 'BSD-3-Clause'
                                   },
                                   {'name' : 'xml2js',
                                    'version' : '0.4.17',
                                    'license' : 'MIT'
                                   },
                                   {'name' : 'react-bootstrap',
                                    'version' : '0.30.7',
                                    'license' : 'MIT'
                                   },
                                   {'name' : 'browserify',
                                    'version' : '13.1.1',
                                    'license' : 'MIT'
                                   }];

        const license_url = {'MIT' : 'https://opensource.org/licenses/mit-license.php',
                             'BSD-3-Clause' : 'https://opensource.org/licenses/BSD-3-Clause'}

        const frontend_licenses = licenses_frontend.map(d =>
            <ListGroupItem key={d.name + d.version}>
                {'Modul: ' + d.name} <br/>
                {'Version: ' + d.version} <br/>
                {'Licens(er): '} <div key={license_url[d.license] + d.license}><a target='_blank'
                                      href={license_url[d.license]}>{d.license}</a></div>
            </ListGroupItem>
        );

        return (
            <div>
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h2>Om Gakusei</h2>
                            <div>
                                <p> Gakusei är en webbapp för övning/inlärning av japanska.
                                    Utvecklingen sker i form av ett open source-projekt.
                                    Utvecklingen har sponsrats av
                                    <a target='_blank' href='https://www.kits.se'> Kits</a>.
                                    Besök gärna projektets
                                    <a target='_blank' href='https://github.com/kits-ab/gakusei/'> Githubsida</a>.
                                </p>
                            </div>
                            <div>
                                <p> Webbappen Gakusei går under licensen
                                    <a target='_blank' href='https://www.opensource.org/licenses/mit-license.php'> MIT</a>.
                                    Nedan följer en lista på licenser för de moduler som projektet använder sig av.
                                </p>
                            </div>
                            <Panel collapsible header='Licenser'>
                                <ListGroup>
                                    {licenses}
                                    {frontend_licenses}
                                </ListGroup>
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
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
                factType4: event.target.checked ? 'english' : ''
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
            {credentials: 'same-origin'})
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
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <QueryInput handleChange={this.updateQueryInput}
                                        handleSubmit={this.fetchCustomQuery}/>
                            <br/>
                            <NuggetList nuggetResults={this.state.nuggetList} />
                        </Col>
                    </Row>
                </Grid>

            </div>
        )
    }
}

class QueryInput extends React.Component{
    render() {
        return(
            <form href='#' onSubmit={this.props.handleSubmit}>
                <FormGroup>
                    <ControlLabel>Filtrera nuggets på:</ControlLabel>
                    <FormControl componentClass='select' id='wordType'
                    onChange={this.props.handleChange}>
                        <option value=''>
                            Alla ordtyper
                        </option>
                        <option value='verb'>
                            Verb
                        </option>
                        <option value='adjective'>
                            Adjektiv
                        </option>
                        <option value='noun'>
                            Substantiv
                        </option>
                        <option value='adverb'>
                            Adverb
                        </option>
                    </FormControl>
                    Nuggeten ska innehålla översättningar från följande språk:
                    <br/>
                    <Checkbox id='kanjiFactType' inline onChange={this.props.handleChange}>
                        Kanji
                    </Checkbox>
                    {' '}
                    <Checkbox id='readingFactType' inline onChange={this.props.handleChange}>
                        Japansk läsform
                    </Checkbox>
                    {' '}
                    <Checkbox  id='writingFactType' inline onChange={this.props.handleChange}>
                        Japansk skrivform
                    </Checkbox>
                    {' '}
                    <Checkbox id='englishFactType' inline onChange={this.props.handleChange}>
                        Engelska
                    </Checkbox>
                </FormGroup>
                <Button type='submit'>
                    Filtrera
                </Button>
            </form>
        )
    }
}

class NuggetList extends React.Component {
    render() {
        const listRows = this.props.nuggetResults.map( (nugget) =>
            <ListGroupItem key={nugget.id}>
                 {'Ordtyp: ' + nugget.type + ' // beskrivning: ' + nugget.description}
                 <FactList factlist={nugget.facts}/>
            </ListGroupItem>
         );
        return(
            <ListGroup>
                {listRows}
            </ListGroup>
        )
    }
}

class FactList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false };
    }
    render(){
        const factListRows = this.props.factlist.map( (fact) =>
            <li key={fact.id} > {'data: ' + fact.data
            + ' // typ: ' + fact.type
            + ' // beskrivning: ' + fact.description}
            </li>
        );
        return(
            <div>
                <Button bsSize='xsmall'
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

class GuessPlaySelection extends React.Component {
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
                    <form href="#" onSubmit={this.handleSubmit}>
                        <Row>
                            <Col xs={8} lg={3}>
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
                            </Col>
                        </Row>
                        <Button type="submit">
                            Starta
                        </Button>
                    </form>
                </Grid>
            </div>
        )
    }
}

const LandingPage = props => {
    return (
        <div>
            <Grid>
                <Row>
                    <Col xs={12}>
                        <div className="text-left">
                            <h3>Välkommen till betaversionen av Gakusei!</h3>
                            <p>
                                Gakusei är en webbapplikation där du kan öva dig på japanska.
                                Den nuvarande versionen har två spellägen.
                            </p>
                            <p>
                                Det första kallas "Gissa ordet".
                                Där ska man välja rätt översättning på ett ord bland fyra alternativ.
                                Just nu kan man välja spelomgångar indelade efter ordklasser.
                            </p>
                            <p>
                                Det andra spelläget kallas för "Översätt ordet".
                                Här gäller det att skriva in rätt översättning på ett ord.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Grid>
        </div>
    )
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.switchPage = this.switchPage.bind(this);
        this.state = {
            currentPage : <LandingPage/>
        }
    }
    switchPage(newContent, selectedLesson) {
        if (newContent === 'GuessPlayPageSelection') {
            this.setState({currentPage : <GuessPlaySelection switchPage={this.switchPage}/>
            });
        }
        else if (newContent === 'GuessPlayPage') {
            this.setState({
                currentPage: <GuessPlayPage selectedLesson={selectedLesson}
                    switchPage={this.switchPage}/>
            });
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
                <GakuseiNav updater={this.switchPage} />
                {this.state.currentPage}
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('index_root'));