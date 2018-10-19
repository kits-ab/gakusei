import * as Security from '../../../../shared/reducers/Security';
import Utility from '../../../../shared/util/Utility';
//import Panel from "react-bootstrap/es/Panel";
import { Col, DropdownButton, Grid, MenuItem, Panel, Row } from 'react-bootstrap';

export const Reducers = [Security];

export class settingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state.title = 'Från';
    this.changeTitle = this.changeTitle().bind(this);
  }
  changeTitle(string) {
    title.setState(string);
  }

  fromLangButton() {
    return (
      <DropdownButton title={this.props.title}>
        <MenuItem onSelect={this.changeTitle('Svenska')}>Svenska</MenuItem>
        <MenuItem>Japanska</MenuItem>
        <MenuItem>Engelska</MenuItem>
      </DropdownButton>
    );
  }
  toLangButton() {
    return (
      <DropdownButton title="Till">
        <MenuItem href="#books">Svenska</MenuItem>
        <MenuItem href="#podcasts">Japanska</MenuItem>
        <MenuItem href="#">Engelska</MenuItem>
      </DropdownButton>
    );
  }

  render() {
    return (
      <div>
        <Grid>
          <Col>
            <h1>Inställningar</h1>
            <h3>Språkalternativ</h3>
            <div>
              {this.fromLangButton()}
              {this.toLangButton()}
            </div>
          </Col>
        </Grid>
      </div>
    );
  }
}
settingsScreen.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

settingsScreen.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

export default Utility.superConnect(this, Reducers)(settingsScreen);
