import React from 'react';
import { Provider } from 'react-redux';
import { browserHistory, Router, Route, IndexRedirect } from 'react-router';
import { persistStore } from 'redux-persist';
import { syncHistoryWithStore } from 'react-router-redux';

import { requireAuthentication } from './shared/components/AuthenticatedComponent';
import configureStore from './configureStore';

import appScreen from './screens/app';
import aboutScreen from './screens/app/screens/about';
import translateScreen from './screens/app/screens/translate';
import listsScreen from './screens/app/screens/lists';
import finishScreen from './screens/app/screens/finish';
import homeScreen from './screens/app/screens/home';
import loginScreen from './screens/app/screens/login';
import logoutScreen from './screens/app/screens/logout';
import playScreen from './screens/app/screens/play';
import selectScreen from './screens/app/screens/select';

export default class AppProvider extends React.Component {
  constructor() {
    super();
    this.state = { rehydrated: false };
  }

  componentWillMount() {
    persistStore(this.props.store, { blacklist: ['someTransientReducer'] }, () => {
      this.setState({ rehydrated: true });
    });
  }

  render() {
    if (this.state.rehydrated) {
      return (<Provider store={this.props.store}>
        <Router history={this.props.history}>
          <Route path="/" component={appScreen}>
            <IndexRedirect to="home" />
            <Route path="login" component={loginScreen} />
            <Route path="logout" component={logoutScreen} />
            <Route path="play/:type" component={requireAuthentication(playScreen)} />
            <Route path="select/:type" component={requireAuthentication(selectScreen)} />
            <Route path="translate" component={requireAuthentication(translateScreen)} />
            {/* <Route path="lists" component={requireAuthentication(listsScreen)} />*/}
            <Route path="finish/:type" component={requireAuthentication(finishScreen)} />
            <Route path="home" component={requireAuthentication(homeScreen)} />
            <Route path="about" component={aboutScreen} />
          </Route>
        </Router>
      </Provider>);
    }
    return null;
  }
}
