import React from 'react';
import ReactDOM from 'react-dom';
import {Button, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

class Form extends React.Component {
    FieldGroup({ id, label, help, ...props }) {
        return (
            <FormGroup controlId={id}>
                <ControlLabel>{label}</ControlLabel>
                <FormControl {...props} />
                {help && <HelpBlock>{help}</HelpBlock>}
            </FormGroup>
        );
    }
    getCSRF() {
        let cookies = document.cookie.split('; ');
        let keys = cookies.map(cookie => cookie.split('=')[0]);
        let csrfValue = cookies[keys.indexOf("XSRF-TOKEN")].split('=')[1];
        return csrfValue;
    }
    render(){
        return (
            <form method="post" action={this.props.actionName}>
                <this.FieldGroup
                    id={this.props.usernameId}
                    name="username"
                    type="text"
                    label="Username"
                    placeholder="Enter username"
                />
                <this.FieldGroup
                    id={this.props.passwordId}
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                />
                <this.FieldGroup
                    id={this.props.csrfId}
                    type="hidden"
                    name="_csrf"
                    value={this.getCSRF()}
                />
                <Button type="submit">
                    {this.props.btnText}
                </Button>
            </form>
        );
    }
}

class Login extends React.Component {
    render(){
        return (
            <div>
                <h2>Login</h2>
                <Form actionName="/auth" usernameId="loginText" passwordId="loginText" csrfId="loginCSRF" btnText="Login"/>
                <h2>User Registration</h2>
                <Form actionName="/registeruser" usernameId="regText" passwordId="regText" csrfId="regCSRF" btnText="Register"/>
            </div>
        );
    }
}

ReactDOM.render(<Login />, document.getElementById('login_root'));