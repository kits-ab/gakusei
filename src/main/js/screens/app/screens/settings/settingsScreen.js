import * as Security from '../../../../shared/reducers/Security';
import Utility from '../../../../shared/util/Utility';

export const Reducers = [Security];

export class settingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }
}
settingsScreen.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

settingsScreen.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

export default Utility.superConnect(this, Reducers)(settingsScreen);
