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
      GuessPlayPage: <GuessPlayPage {...props} />,
      TranslationPlayPage: <TranslationPlayPage />,
      NuggetListPage: <NuggetListPage />,
      AboutPage: <AboutPage />,
      EndScreenPage: <EndScreenPage {...props} />,
      LandingPage: <LandingPage />
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
