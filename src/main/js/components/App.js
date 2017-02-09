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
import UserStatisticPage from './UserStatisticsPage';
import QuizPlayPage from './QuizPlayPage';
import QuizSelection from './QuizSelection';
import GrammarPage from './GrammarPage';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.switchPage = this.switchPage.bind(this);
    this.state = { currentPage: <LandingPage /> };
  }
  componentDidMount() {
    this.setLoggedInUser();
  }
  setLoggedInUser() {
    fetch('/username', { credentials: 'same-origin' })
      .then(response => response.text())
      .then(user => this.setState({ loggedInUser: user }));
  }
  switchPage(newContent, newProps) {
    const props = Object.assign(
      {
        switchPage: this.switchPage,
        username: this.state.loggedInUser
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
      UserStatisticsPage: <UserStatisticPage {...props} />,
      GrammarPage: <GrammarPage />
    };
    this.setState({ currentPage: pages[newContent] });
  }
  render() {
    return (
      <div>
        <GakuseiNav switchPage={this.switchPage} username={this.state.loggedInUser} />
        {this.state.currentPage}
      </div>
    );
  }
}
