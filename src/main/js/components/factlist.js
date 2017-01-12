import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

export default class FactList extends React.Component {
    render(){
        const factListRows = this.props.factlist.map( (fact) =>
            <ListGroupItem key={fact.id} > {'data: ' + fact.data
            + ', typ: ' + fact.type
            + ', beskrivning: ' + fact.description}
            </ListGroupItem>
        );
        return(
             <ListGroup>
                  {factListRows}
             </ListGroup>
        )
    }
}