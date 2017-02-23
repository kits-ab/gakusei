import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import MyLoginForm from './components/MyLoginForm';
import MyRegistrationForm from './components/MyRegistrationForm';

import Utility from '../../../../shared/util/Utility';
import * as Security from '../../../../shared/stores/Security';

export const Reducers = [Security];

export class loginScreen extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xsOffset={0} xs={12} smOffset={3} sm={6} mdOffset={4} md={4}>
            <h2>Logga in</h2>
            <MyLoginForm />
            <MyRegistrationForm />
          </Col>
        </Row>
      </Grid>
    );
  }
}

loginScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

loginScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);

export default Utility.superConnect(this, Reducers)(loginScreen);
