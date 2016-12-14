class GakuseiNav extends React.Component {
    render() {
        return (
        <ReactBootstrap.Navbar inverse collapseOnSelect>
            <ReactBootstrap.Navbar.Header>
                <ReactBootstrap.Navbar.Brand>
                    <span><a href="#"><img height={'100%'} src="/img/temp_gakusei_logo3.png" alt="Gakusei logo"/></a>Gakusei</span>
                </ReactBootstrap.Navbar.Brand>
                <ReactBootstrap.Navbar.Toggle />
            </ReactBootstrap.Navbar.Header>
            <ReactBootstrap.Navbar.Collapse>
                {/*<ReactBootstrap.Nav>*/}
                    {/*<ReactBootstrap.NavItem eventKey={1} href="#">Link</ReactBootstrap.NavItem>*/}
                    {/*<ReactBootstrap.NavItem eventKey={2} href="#">Link</ReactBootstrap.NavItem>*/}
                    {/*<ReactBootstrap.NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">*/}
                        {/*<ReactBootstrap.MenuItem eventKey={3.1}>Action</ReactBootstrap.MenuItem>*/}
                        {/*<ReactBootstrap.MenuItem eventKey={3.2}>Another action</ReactBootstrap.MenuItem>*/}
                        {/*<ReactBootstrap.MenuItem eventKey={3.3}>Something else here</ReactBootstrap.MenuItem>*/}
                        {/*<ReactBootstrap.MenuItem divider />*/}
                        {/*<ReactBootstrap.MenuItem eventKey={3.3}>Separated link</ReactBootstrap.MenuItem>*/}
                    {/*</ReactBootstrap.NavDropdown>*/}
                {/*</ReactBootstrap.Nav>*/}
                <ReactBootstrap.Nav pullRight>
                    <ReactBootstrap.NavItem eventKey={2} href="#">About</ReactBootstrap.NavItem>
                    <ReactBootstrap.Navbar.Text>
                        <ReactBootstrap.Navbar.Link href="/logout">Logout</ReactBootstrap.Navbar.Link>
                    </ReactBootstrap.Navbar.Text>
                </ReactBootstrap.Nav>
            </ReactBootstrap.Navbar.Collapse>
        </ReactBootstrap.Navbar>
        )
    }
}

class AnswerButton extends React.Component {
    onClick() {
        fetch(`http://localhost:8080/api/question/${this.props.label}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
    }
    render() {
        return <ReactBootstrap.Button bsSize="large" block type="button" onClick={this.onClick.bind(this)}>{this.props.label}</ReactBootstrap.Button>
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {question: '',
                      alternative1: '',
                      alternative2: '',
                      alternative3: '',
                      correctAlternative: ''
                      }
    }
    componentDidMount() {
        fetch('http://localhost:8080/api/question/', {credentials: "same-origin"})
            .then(result => result.json())
            .then(response => this.setState({question: response.question,
                                             alternative1: response.alternative1,
                                             alternative2: response.alternative2,
                                             alternative3: response.alternative3,
                                             correctAlternative: response.correctAlternative
                                             }));
    }
    render() {
        return (
        <div>
        <GakuseiNav/>
        <ReactBootstrap.Grid>
            <ReactBootstrap.Row><h2 className="text-center">{this.state.question}</h2></ReactBootstrap.Row>
            <ReactBootstrap.Row>
                <ReactBootstrap.ButtonToolbar block>
                    <ReactBootstrap.Col xs={5} xsOffset={1} sm={4} smOffset={2} md={3} mdOffset={3}>
                        <AnswerButton label = {this.state.alternative1}/>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={5} sm={4} md={3}>
                        <AnswerButton label = {this.state.alternative2}/>
                    </ReactBootstrap.Col>
                </ReactBootstrap.ButtonToolbar>
            </ReactBootstrap.Row>
            <br/>
            <ReactBootstrap.Row>
                <ReactBootstrap.ButtonToolbar>
                    <ReactBootstrap.Col xs={5} xsOffset={1} sm={4} smOffset={2} md={3} mdOffset={3}>
                        <AnswerButton label = {this.state.alternative3}/>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={5} sm={4} md={3}>
                        <AnswerButton label = {this.state.correctAlternative}/>
                    </ReactBootstrap.Col>
                </ReactBootstrap.ButtonToolbar>
            </ReactBootstrap.Row>
        </ReactBootstrap.Grid>
        </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));