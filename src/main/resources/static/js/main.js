class AnswerButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {buttonStyle: "default",
                      result: "",
                      answered: ""
        };
      }

      componentDidMount(){
            this.setState({correctAnswer: this.props.correctAnswer,
                    answered: this.props.label});
      }

    onClick() {

//        fetch("http://localhost:8080/api/answer", {
//            method: 'POST',
//            headers: {
//                'Accept': 'application/json',
//                'Content-Type': 'application/json',
//            },
//            body: JSON.stringify({'answer': this.props.label})
//        });
    }
    render() {
        return (

            <ReactBootstrap.Button bsStyle={this.state.buttonStyle} bsSize="large" onClick={this.props.onAnswerClick.bind(this, this.props.label)}> {this.props.label} </ReactBootstrap.Button>

        )
    };
}

//this.onClick.bind(this)
//this.props.onAnswerClick

class NextButton extends React.Component{

    constructor(props) {
        super(props);
        this.state = {question: '',
                        alternative1: '',
                        alternative2: '',
                        alternative3: '',
                        correctAlternative: ''};
    }

    render(){
        return(
            <ReactBootstrap.Button bsStyle="info" onClick={this.props.onMagicClick}> Next Question </ReactBootstrap.Button>
        )
    }
}

class ResultText extends React.Component{

    constructor(props) {
        super(props);
        this.state = {resultDisplay: "Click answer."};
    }

    componentDidMount() {
        this.setState({resultDisplay: this.props.result});
    }

    render(){
        return(
            <h4>{this.props.result}</h4>
            )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {question: '',
                      alternative1: '',
                      alternative2: '',
                      alternative3: '',
                      correctAlternative: '',
                      questionReturn: '',
                      answerReturn: 'Click the answer!'
                      }
        this.fetchQuestion = this.fetchQuestion.bind(this);
        this.postAnswer = this.postAnswer.bind(this);
    }

    fetchQuestion(){
            fetch('http://localhost:8080/api/question/', {credentials: "same-origin"})
                .then(result => result.json())
                .then(response => this.setState({question: response.question,
                alternative1: response.alternative1,
                alternative2: response.alternative2,
                alternative3: response.alternative3,
                correctAlternative: response.correctAlternative
                }));

            this.setState({
                answerReturn: "click the answer"
            });
    }

    postAnswer(answer){
        //alert('TAADAH!');

        this.setState({
            answerReturn: (answer === this.state.correctAlternative) ? "correct" : "incorrect"
        });
    }

    componentDidMount() {
            this.fetchQuestion();
    }

    render() {
        return (
        <div>
            <h1>Gakusei</h1>
            <h2>{this.state.question}</h2>
            <form>
                <ReactBootstrap.ButtonToolbar>
                    <AnswerButton label = {this.state.alternative1} correctAnswer={this.state.correctAlternative} onAnswerClick={this.postAnswer} buttonStyle="default" />

                    <AnswerButton label = {this.state.alternative2}  correctAnswer={this.state.correctAlternative} onAnswerClick={this.postAnswer} buttonStyle="default" />

                    <AnswerButton label = {this.state.alternative3} correctAnswer={this.state.correctAlternative} onAnswerClick={this.postAnswer} buttonStyle="default" />

                    <AnswerButton label = {this.state.correctAlternative} correctAnswer={this.state.correctAlternative} onAnswerClick={this.postAnswer} buttonStyle="default" />
                </ReactBootstrap.ButtonToolbar>
            </form>

            <div>{this.state.answerReturn}</div>
            <br/><br/>
            <NextButton onMagicClick={this.fetchQuestion}/>

        </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

// <ResultText result={this.state.answerReturn}/>