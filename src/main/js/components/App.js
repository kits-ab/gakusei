/* global fetch*/

import React from 'react';
import 'whatwg-fetch';
import { connect } from 'react-redux';

import GakuseiNav from './GakuseiNav';

import * as Store from '../Store';

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

const temporaryStuff = null;

export class App extends React.Component {
  constructor(props) {
    super(props);

    // this.props.setSwitchPageReference(this.switchPage);
    // this.switchPage = this.switchPage.bind(this);
    // this.state = { currentPage: <LandingPage /> };
    
    this.props.fetchLoggedInUser();
  }
  componentDidMount() {
    // this.setLoggedInUser();
    this.switchPage('LandingPage');
  }
  // setLoggedInUser() {
  //   // fetch('/username', { credentials: 'same-origin' })
  //   //   .then(response => response.text())
  //   //   .then(user => this.setState({ loggedInUser: user }));
  // }
  switchPage(pageName, newProps) {
    const props = Object.assign(
      {
        switchPage: this.switchPage
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
    this.setState({ currentPage: pages[pageName] });
  }
  render() {
    return (
      <div>
        { this.props.loggedIn ?
          <div>
            <GakuseiNav />
            { this.state !== null ? this.state.currentPage : <p>Loading...</p> }
          </div> :
          <p>Loading...</p>}
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
  fetchLoggedInUser: React.PropTypes.func.isRequired,
  setPageByName: React.PropTypes.func.isRequired
};

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    // Selects which state properties are merged into the component's props
    state => (state.reducer),
    // Selects which action creators are merged into the component's props
    Store.actionCreators
)(App);
