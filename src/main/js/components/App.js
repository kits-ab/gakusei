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

const temporaryStuff = null;

export class App extends React.Component {
  constructor(props) {
    super(props);

    // this.props.setSwitchPageReference(this.switchPage);
    // this.switchPage = this.switchPage.bind(this);
    // this.state = { currentPage: <LandingPage /> };
  }
  componentWillMount() {
    debugger;
    this.props.increase();
    this.props.fetchLoggedInUser();
  }
  // setLoggedInUser() {
  //   // fetch('/username', { credentials: 'same-origin' })
  //   //   .then(response => response.text())
  //   //   .then(user => this.setState({ loggedInUser: user }));
  // }
  // switchPage(pageName, newProps) {
  //   const props = Object.assign(
  //     {
  //       switchPage: this.switchPage
  //     },
  //     newProps);
  //   const pages = {
  //     LessonSelection: <LessonSelection {...props} />,
  //     QuizSelection: <QuizSelection {...props} />,
  //     GuessPlayPage: <GuessPlayPage {...props} />,
  //     QuizPlayPage: <QuizPlayPage {...props} />,
  //     TranslationPlayPage: <TranslationPlayPage {...props} />,
  //     NuggetListPage: <NuggetListPage />,
  //     AboutPage: <AboutPage />,
  //     EndScreenPage: <EndScreenPage {...props} />,
  //     LandingPage: <LandingPage />,
  //     UserStatisticsPage: <UserStatisticsPage {...props} />
  //   };
  //   this.setState({ currentPage: pages[pageName] });
  // }

  render() {
    return (
      <div>
        { this.props.loggedIn ?
          <div>
            <GakuseiNav />
            {/* <Link to="landing">test</Link>*/}
            { this.props.children }
          </div> :
          <p>Loading...</p>}
      </div>
    );
  }
}


App.propTypes = {
      /* <div>
        { this.props.loggedIn ?
          <div>
            <GakuseiNav />
            <a href="guess-play">test</a>
            { this.props.children }
            { this.state !== null ? this.state.currentPage : <p>Loading...</p> }
          </div> :
          <p>Loading...</p>}
      </div>*/

  // redux props
  // currentPage: React.PropTypes.any.isRequired,
  loggedIn: React.PropTypes.bool.isRequired,
  // loggedInUser: React.PropTypes.string.isRequired,
  // action creators
  fetchLoggedInUser: React.PropTypes.func.isRequired,
  // setPageByName: React.PropTypes.func.isRequired
};

// Wire up the React component to the Redux store and export it when importing this file
export default connect(
    // Selects which state properties are merged into the component's props
    state => (Object.assign({}, state.reducer, state.reducerx)),
    // Selects which action creators are merged into the component's props
    Object.assign({}, Store.actionCreators, Test.actionCreators)
)(App);
