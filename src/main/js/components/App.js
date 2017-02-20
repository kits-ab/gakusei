/* global fetch*/

import React from 'react';
import 'whatwg-fetch';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import GakuseiNav from './GakuseiNav';

import * as Lessons from '../Lessons';
import * as Test from '../Test';
import * as Security from '../Security';
import * as Statistics from '../Statistics';

export class App extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
  componentWillMount() {
    this.props.fetchLoggedInUser();
  }

  render() {
    return (
      <div>
        <div>
          <GakuseiNav />
          {/* <Link to="landing">test</Link>*/}
          { this.props.children }
        </div>
      </div>
    );
  }
}


App.propTypes = {
  // redux props
  // currentPage: React.PropTypes.any.isRequired,
  loggedIn: React.PropTypes.bool.isRequired,
  // loggedInUser: React.PropTypes.string.isRequired,
  // action creators
  fetchLoggedInUser: React.PropTypes.func.isRequired
  // setPageByName: React.PropTypes.func.isRequired
};

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    // Selects which state properties are merged into the component's props
    state => (Object.assign({}, state.lessons, state.testing, state.security, state.lessons)),
    // Selects which action creators are merged into the component's props
    Object.assign({}, Lessons.actionCreators, Test.actionCreators, Security.actionCreators, Statistics.actionCreators)
)(App);
