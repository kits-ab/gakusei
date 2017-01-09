import React from 'react';
import {Button, Collapse} from 'react-bootstrap';

export default class FactList extends React.Component {
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