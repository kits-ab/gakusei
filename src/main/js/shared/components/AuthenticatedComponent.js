import React from 'react';

import Utility from '../../shared/util/Utility';
import * as Security from '../../shared/stores/Security';
import * as Lessons from '../../shared/stores/Lessons';

export const Reducers = [Security, Lessons];

export function requireAuthentication(Component) {
  class AuthenticatedComponent extends React.Component {

    componentWillMount() {
      this.checkAuth(this.props.loggedIn);
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth(nextProps.loggedIn);
    }

    checkAuth(isAuthenticated) {
      // if(isAuthenticated === null) {
      //   // Do api call to check logged in state
      //   // uh, lets use persist instead
      // }

      if (!isAuthenticated) {
        const redirectAfterLogin = this.props.location.pathname;
        this.props.setPageByName('login', { redirectUrl: redirectAfterLogin });
        // this.props.dispatch(pushState(null, `/login?next=${redirectAfterLogin}`));
      }
    }

    render() {
      return (
        <div>
          {this.props.loggedIn
                        ? <Component {...this.props} />
                        : null
                    }
        </div>
      );
    }
    }

  AuthenticatedComponent.defaultProps = Utility.reduxEnabledDefaultProps({

  }, Reducers);

  AuthenticatedComponent.propTypes = Utility.reduxEnabledPropTypes({

  }, Reducers);


  return Utility.superConnect(this, Reducers)(AuthenticatedComponent);
}

