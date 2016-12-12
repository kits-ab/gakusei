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
        return <button type="button" onClick={this.onClick.bind(this)}>{this.props.label}</button>
    }

}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {character: '',
                      alternatives: []
                      }
    }
    componentDidMount() {
        fetch('http://localhost:8080/api/question/', {credentials: "same-origin"})
            .then(result => result.json())
            .then(response => this.setState({character: response.nugget.description,
                                             alternatives: response.alternatives}));

    }
    render() {
        return (
        <div>
            <h1>Gakusei</h1>
            <h2>{this.state.character}</h2>
            {this.state.alternatives.map( alternative =>
                    <AnswerButton key = {alternative.data} label = {alternative.data}/>
            )}
        </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));