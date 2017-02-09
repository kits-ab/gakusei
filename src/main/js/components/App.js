/* global fetch*/

import React from 'react';
import 'whatwg-fetch';
import { connect } from 'react-redux';

import GakuseiNav from './GakuseiNav';
import GuessPlayPage from './GuessPlayPage';
import AboutPage from './AboutPage';
import TranslationPlayPage from './TranslationPlayPage';
import NuggetListPage from './NuggetListPage';
import LessonSelection from './LessonSelection';
import LandingPage from './LandingPage';
import EndScreenPage from './EndScreenPage';
import UserStatisticPage from './UserStatisticsPage';
import QuizPlayPage from './QuizPlayPage';
import QuizSelection from './QuizSelection';

import * as SecurityStore from '../store/Security';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.switchPage = this.switchPage.bind(this);
    this.state = { currentPage: <LandingPage /> };

    this.props.fetchLoggedInUser();
  }
  componentDidMount() {
    // this.setLoggedInUser();
  }
  // setLoggedInUser() {
  //   // fetch('/username', { credentials: 'same-origin' })
  //   //   .then(response => response.text())
  //   //   .then(user => this.setState({ loggedInUser: user }));
  // }
  switchPage(newContent, newProps) {
    const props = Object.assign(
      {
        switchPage: this.switchPage,
        username: this.props.loggedInUser
      },
      newProps);
    const pages = {
      LessonSelection: <LessonSelection {...props} />,
      QuizSelection: <QuizSelection {...props} />,
      GuessPlayPage: <GuessPlayPage {...props} />,
      QuizPlayPage: <QuizPlayPage {...props} />,
      TranslationPlayPage: <TranslationPlayPage {...props} />,
      NuggetListPage: <NuggetListPage />,
      AboutPage: <AboutPage />,
      EndScreenPage: <EndScreenPage {...props} />,
      LandingPage: <LandingPage />,
      UserStatisticsPage: <UserStatisticPage {...props} />
    };
    this.setState({ currentPage: pages[newContent] });
  }
  render() {
    return (
      <div>
        { this.props.loggedIn ?
          <div>
            <GakuseiNav switchPage={this.switchPage} username={this.props.loggedInUser} />
            { this.state.currentPage }
          </div> :
          <p>Loading...</p>}
      </div>
    );
  }
}

App.propTypes = {
  // used action creators
  fetchLoggedInUser: React.PropTypes.func.isRequired,
  loggedIn: React.PropTypes.bool.isRequired,
  loggedInUser: React.PropTypes.string.isRequired
};

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    state => state.security, // Selects which state properties are merged into the component's props
    { ...SecurityStore.actionCreators } // Selects which action creators are merged into the component's props
)(App);
