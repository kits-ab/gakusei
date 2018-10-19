import * as Security from '../../../../shared/reducers/Security';
import Utility from '../../../../shared/util/Utility';
//import Panel from "react-bootstrap/es/Panel";
import { Col, Grid, Panel, Row } from 'react-bootstrap';

export const Reducers = [Security];

export class settingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <div>
                <Panel>
                  <Panel.Body>
                    <div className={'exercise'}>
                      <div className={'exercise__header'}>
                        <p>Testing</p>
                      </div>
                    </div>
                  </Panel.Body>
                </Panel>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
settingsScreen.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

settingsScreen.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

export default Utility.superConnect(this, Reducers)(settingsScreen);
