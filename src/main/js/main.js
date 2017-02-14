/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router, Route, IndexRedirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import App from './components/App';
import configureStore from './configureStore';


// import GuessPlayPage from './components/GuessPlayPage';
import AboutPage from './components/AboutPage';
import TranslationPlayPage from './components/TranslationPlayPage';
import NuggetListPage from './components/NuggetListPage';
// import LessonSelection from './components/LessonSelection';
import LandingPage from './components/LandingPage';
import EndScreenPage from './components/EndScreenPage';
import UserStatisticsPage from './components/UserStatisticsPage';
// import QuizPlayPage from './components/QuizPlayPage';
// import QuizSelection from './components/QuizSelection';
import Login from './components/Login';

// New
import FourAlternativeQuestion from './components/FourAlternativeQuestion';
import GenericSelection from './components/GenericSelection';

// Get the application-wide store instance, prepopulating with state from the server where available.
// ! Don't have server-rendering yet, might add later
const initialState = window.initialReduxState;
const store = configureStore(initialState);


// const rootRoute = {
//   childRoutes: [{
//     path: '/',
//     component: App,
//     childRoutes: [
//       LessonSelection,
//       QuizSelection,
//       GuessPlayPage,
//       QuizPlayPage,
//       TranslationPlayPage,
//       NuggetListPage,
//       AboutPage,
//       EndScreenPage,
//       LandingPage,
//       UserStatisticsPage
//     ]
//   }]
// };

// const history = syncHistoryWithStore(browserHistory, store);

      //   this.props.setGameMode('GuessPlay');
      //   this.props.setPageByName('LessonSelection'); break;
      // case 1.2:
      //   this.props.setGameMode('TranslationPlay');
      //   this.props.setPageByName('LessonSelection'); break;
      // case 1.3:
      //   this.props.setGameMode('QuizPlay');
      //   this.props.setPageByName('QuizSelection'); break;

// Create an enhanced history that syncs navigation events with the store

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route name="Gakusei" path="/" component={App}>
        {/* <IndexRedirect to="home" />*/}
        <IndexRedirect to="login" />
        <Route path="/login" component={Login} />
        <Route path="/home" component={LandingPage} />
        <Route path="/play" component={FourAlternativeQuestion} />
        <Route path="/select" component={GenericSelection} />
        <Route path="/translate" component={TranslationPlayPage} />
        <Route path="/lists" component={NuggetListPage} />
        <Route path="/finish" component={EndScreenPage} />
        <Route path="/profile" component={UserStatisticsPage} />
        <Route path="/about" component={AboutPage} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('index_root'));
