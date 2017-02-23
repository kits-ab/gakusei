

import React from 'react';
import 'whatwg-fetch';

import GakuseiNav from './components/GakuseiNav';

import Utility from '../../shared/util/Utility';
import * as Security from '../../shared/stores/Security';

export const Reducers = [Security];

export class appScreen extends React.Component {
  componentWillMount() {
    this.props.fetchLoggedInUser();
  }

  render() {
    return (
      <div>
        <GakuseiNav />
        { this.props.children }
      </div>
    );
  }
}

appScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

appScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);

export default Utility.superConnect(this, Reducers)(appScreen);
