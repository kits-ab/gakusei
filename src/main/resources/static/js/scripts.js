class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {users: []}
    }
    componentDidMount() {
        fetch('http://localhost:8080/api/users/')
            .then(result => result.json())
            .then(users => this.setState({users: users._embedded.users}));
    }
    render() {
        return <ul>{this.state.users.map(function (user) {
            return <li key={user._links.self.href}>{user.username}</li>
        })}</ul>;
    }
}

ReactDOM.render(<Users />, document.getElementById('root'));
