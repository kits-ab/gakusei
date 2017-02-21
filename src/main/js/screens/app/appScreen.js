/* global fetch*/

import React from 'react';
import 'whatwg-fetch';
import { connect } from 'react-redux';
// import { Link } from 'react-router';

import GakuseiNav from './components/GakuseiNav';

import Utility from '../../shared/util/Utility';
import * as Security from '../../shared/stores/Security';

export const Reducers = [Security];

export class appScreen extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
  componentWillMount() {
    this.props.fetchLoggedInUser();
  }

  render() {
    return (
      <div>
        <GakuseiNav />
        {/* <Link to="landing">test</Link>*/}
        { this.props.children }
      </div>
    );
  }
}


function generatePropsFromReducer(reducers) {
  let result = [];
  reducers.forEach(reducer => (result.push({
    ...() => {
      const dynamicPropTypes = {};
      Object.keys(reducer.actionCreators).forEach((x) => {
        dynamicPropTypes[x] = React.PropTypes.func.isRequired;
      });
      return dynamicPropTypes;
    },
    ...reducer.propTypes
  })));
}

appScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

appScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);

// Wire up the React component to the Redux store and export it when importing this file
export default Utility.superConnect(this, Reducers)(appScreen);
