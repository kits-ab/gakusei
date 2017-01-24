import React from 'react';
import ReactDOM from 'react-dom';
import {Button, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';
import getCSRF from './util/getcsrf'

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
    render(){
        return (
            <form method="post" action={this.props.actionName}>
                <this.FieldGroup
                    id={this.props.usernameId}
                    name="username"
                    type="text"
                    label="Användarnamn"
                    placeholder="Skriv in ditt användarnamn här"
                />
                <this.FieldGroup
                    id={this.props.passwordId}
                    name="password"
                    label="Lösenord"
                    type="password"
                    placeholder="Skriv in ditt lösenord här"
                />
                <this.FieldGroup
                    id={this.props.csrfId}
                    type="hidden"
                    name="_csrf"
                    value={getCSRF()}
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
                <h2>Logga in</h2>
                <Form actionName="/auth" usernameId="loginText" passwordId="loginText" csrfId="loginCSRF" btnText="Logga in"/>
                <h2>Registrera användare</h2>
                <Form actionName="/registeruser" usernameId="regText" passwordId="regText" csrfId="regCSRF" btnText="Registrera användare"/>
            </div>
        );
    }
}

ReactDOM.render(<Login />, document.getElementById('login_root'));