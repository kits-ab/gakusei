import React from 'react';
import getCSRF from '../../../../shared/util/getcsrf';
import Utility from '../../../../shared/util/Utility';
import * as Security from '../../../../shared/reducers/Security';

export const Reducers = [Security];

export class logoutScreen extends React.Component {

  componentWillMount() {
    this.props.requestUserLogout(this.props.location.query.currentUrl || '/', getCSRF());
  }

  render() {
    return null;
  }
}

logoutScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

logoutScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);

export default Utility.superConnect(this, Reducers)(logoutScreen);
