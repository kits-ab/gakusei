import Utility from '../../shared/util/Utility';
import * as Security from '../../shared/reducers/Security';
import * as Lessons from '../../shared/reducers/Lessons';
import { Redirect } from 'react-router';

export const Reducers = [Security, Lessons];

export function requireAuthentication(Component, ReplacementComponent = null) {
  class AuthenticatedComponent extends React.Component {
    getComponent() {
      if (this.props.loggedIn) {
        return <Component {...this.props} />;
      } else if (ReplacementComponent) {
        return <ReplacementComponent {...this.props} />;
      } else {
        return <Redirect to="/" />;
      }
    }

    render() {
      return this.getComponent();
    }
  }

  AuthenticatedComponent.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

  AuthenticatedComponent.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

  return Utility.superConnect(this, Reducers)(AuthenticatedComponent);
}
