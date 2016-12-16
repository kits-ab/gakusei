class AnswerButton extends React.Component {
    onClick() {
        fetch(`/api/question/${this.props.label}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
    }
    render() {
        return <button type="button" onClick={this.onClick.bind(this)}>{this.props.label}</button>
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
        fetch('/api/question/', {credentials: "same-origin"})
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
            <h1>Gakusei</h1>
            <h2>{this.state.question}</h2>
            <AnswerButton label = {this.state.alternative1}/>
            <AnswerButton label = {this.state.alternative2}/>
            <AnswerButton label = {this.state.alternative3}/>
            <AnswerButton label = {this.state.correctAlternative}/>
        </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));