import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRedirect } from 'react-router';
import { anchorate } from 'anchorate';
import { persistStore } from 'redux-persist';

import { requireAuthentication } from './shared/components/AuthenticatedComponent';

import appScreen from './screens/app';
import aboutScreen from './screens/app/screens/about';
import listsScreen from './screens/app/screens/lists';
import grammarScreen from './screens/app/screens/grammar';
import finishScreen from './screens/app/screens/finish';
import homeScreen from './screens/app/screens/home';
import loginScreen from './screens/app/screens/login';
import logoutScreen from './screens/app/screens/logout';
import playScreen from './screens/app/screens/play';
import selectScreen from './screens/app/screens/select';

function onUpdate() {
  anchorate(); // To have href's that can scroll to page sections
}

export default class AppProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rehydrated: false,
      persistor: null
    };
  }

  componentWillMount() {
    // Redux store purging logic (aka "has project.json version changed?")
    // For now, we let security reducer determine purging decision for all reducers
    this.setState({
      persistor: persistStore(this.props.store, { blacklist: ['routing'] }, (err, state) => {
        if (state.security && state.security.purgeNeeded) {
          this.state.persistor.purge().then(this.setState({ rehydrated: true }));
        } else {
          this.setState({ rehydrated: true });
        }
      }) });
  }

  render() {
    if (this.state.rehydrated) {
      return (<Provider store={this.props.store}>
        <Router onUpdate={onUpdate} history={this.props.history}>
          <Route path="/" component={appScreen}>
            <IndexRedirect to="home" />
            <Route path="login" component={loginScreen} />
            <Route path="logout" component={logoutScreen} />
            <Route path="play/:type" component={requireAuthentication(playScreen)} />
            <Route path="select/:type" component={requireAuthentication(selectScreen)} />
            <Route path="grammar" component={requireAuthentication(grammarScreen)} />
            {/* <Route path="lists" component={requireAuthentication(listsScreen)} /> */}
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
