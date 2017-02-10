import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as Store from '../Store';


const FactList = (props) => {
  const factListRows = props.factlist.map(fact =>
    <ListGroupItem key={fact.id}>data: {fact.data}, typ: {fact.type}, beskrivning: {fact.description}</ListGroupItem>
  );
  return (<ListGroup>{factListRows}</ListGroup>);
};

FactList.propTypes = {
  factlist: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
};

export default connect(
    // Selects which state properties are merged into the component's props
    state => (state.reducer),
    // Selects which action creators are merged into the component's props
    Store.actionCreators
)(FactList);
