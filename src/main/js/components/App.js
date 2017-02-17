/* global fetch*/

import React from 'react';
import 'whatwg-fetch';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import GakuseiNav from './GakuseiNav';

import * as Store from '../Store';
import * as Test from '../Test';

import GuessPlayPage from './GuessPlayPage';
import AboutPage from './AboutPage';
import TranslationPlayPage from './TranslationPlayPage';
import NuggetListPage from './NuggetListPage';
import LessonSelection from './LessonSelection';
import LandingPage from './LandingPage';
import EndScreenPage from './EndScreenPage';
import UserStatisticsPage from './UserStatisticsPage';
import QuizPlayPage from './QuizPlayPage';
import QuizSelection from './QuizSelection';

import Login from './Login';
import getCSRF from '../util/getcsrf';
import GrammarPage from './GrammarPage';

export class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    debugger;
    this.props.doAnotherTest();
    this.props.doThirdTest();
    this.props.fetchLoggedInUser();
  }

  render() {
    // const navProps = this.assignProps();
    return (
      <div>
        <GakuseiNav />
        { this.props.children }
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


// Selects which state properties are merged into the component's props
function mapStateToProps(state) {
  return Object.assign({},
      state.Main,
      state.Test);
}

// Selects which action creators are merged into the component's props
function mapActionCreatorsToProps() {

  const result = Object.assign({},
      Store.actionCreators,
      Test.actionCreators);
  return result;
}

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    mapStateToProps,
    mapActionCreatorsToProps
)(App);
