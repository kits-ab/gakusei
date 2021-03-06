import { ListGroup, ListGroupItem } from 'react-bootstrap';

const FactList = props => {
  const factListRows = props.factlist.map(fact => (
    <ListGroupItem key={fact.id}>
      data: {fact.data}, typ: {fact.type}, beskrivning: {fact.description}
    </ListGroupItem>
  ));
  return <ListGroup>{factListRows}</ListGroup>;
};

FactList.propTypes = {
  factlist: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default FactList;
