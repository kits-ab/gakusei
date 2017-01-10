import React from 'react';
import {Accordion, Panel} from 'react-bootstrap';
import FactList from './factlist'

export default class NuggetList extends React.Component {
    render() {
        const listRows = this.props.nuggetResults.map( (nugget) =>
            <Panel header={'Ordtyp: ' + nugget.type + ', beskrivning: ' + nugget.description}
                   eventKey={nugget.id}
                   key={nugget.id}>
                 <FactList factlist={nugget.facts}/>
            </Panel>
         );
        return(
            <Accordion>
                {listRows}
            </Accordion>
        )
    }
}
