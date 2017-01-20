import React from 'react';
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
  switchPage(newContent, newProps) {
    const props = Object.assign({ switchPage: this.switchPage }, newProps);
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
        <GakuseiNav updater={this.switchPage} />
        {this.state.currentPage}
      </div>
    );
  }
}
