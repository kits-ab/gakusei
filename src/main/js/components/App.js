/* global fetch*/

import React from 'react';
import 'whatwg-fetch';
import GakuseiNav from './GakuseiNav';
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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.switchPage = this.switchPage.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
    this.setLoggedInUser = this.setLoggedInUser.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      currentPage: <LandingPage />,
      loggedIn: false,
      loggedInUser: 'No one'
    };
  }
  componentWillMount() {
    fetch('/username', { credentials: 'same-origin' })
      .then(response => response.json())
      .then((json) => { if (json.loggedIn === 'true') this.setLoggedInUser(json.username); });
  }
  setLoggedInUser(username) {
    this.setState(
      {
        loggedInUser: username,
        loggedIn: true
      }
    );
  }
  isLoggedIn() {
    return this.state.loggedIn;
  }
  logout() {
    const xsrfTokenValue = getCSRF();
    fetch('/logout',
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'X-XSRF-TOKEN': xsrfTokenValue
        }
      });
    this.setState(
      {
        loggedInUser: 'No one',
        loggedIn: false
      }
    );
  }
  switchPage(newContent, newProps) {
    const props = this.assignProps(newProps);
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
      UserStatisticsPage: <UserStatisticsPage {...props} />,
      Login: <Login {...props} setLoggedInUser={this.setLoggedInUser} />,
      GrammarPage: <GrammarPage />
    };
    this.setState({ currentPage: pages[newContent] });
  }
  assignProps(newProps) {
    return Object.assign(
      {
        switchPage: this.switchPage,
        isLoggedIn: this.isLoggedIn,
        username: this.state.loggedInUser
      },
      newProps);
  }
  render() {
    const navProps = this.assignProps();
    return (
      <div>
        <GakuseiNav {...navProps} logout={this.logout} />
        {this.state.currentPage}
      </div>
    );
  }
}
