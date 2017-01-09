import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import FactList from './factlist'

export default class NuggetList extends React.Component {
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