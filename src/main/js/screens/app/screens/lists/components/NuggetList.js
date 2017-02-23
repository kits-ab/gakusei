import React from 'react';
import { Accordion, Panel } from 'react-bootstrap';
import FactList from './FactList';

const NuggetList = (props) => {
  const listRows = props.nuggetResults.map(nugget =>
    <Panel
      header={`Ordtyp: ${nugget.type}, beskrivning: ${nugget.description}`}
      eventKey={nugget.id}
      key={nugget.id}
    >
      <FactList factlist={nugget.facts} />
    </Panel>
  );
  return (
    <Accordion>
      {listRows}
    </Accordion>
  );
};

NuggetList.propTypes = {
  nuggetResults: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
};

export default NuggetList;
