import Utility from '../../../shared/util/Utility';
import { withRouter } from 'react-router-dom';

import * as Security from '../../../shared/reducers/Security';

export const Reducers = [Security];

export class InfoBanner extends React.Component {
  render() {
    return (
      <div>
        {this.props.announcement.map((announcement, i) => {
          return (
            <div
              key={'div' + i}
              className="announcement"
            >
              <p
                className={'announcementText'}
                key={i}
              >
                {announcement.text}
              </p>
              <button
                className={'announcementButton'}
                onClick={this.props.disableAnnouncement.bind(this)}
              >
                X
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}

InfoBanner.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

InfoBanner.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);
export default Utility.superConnect(this, Reducers)(withRouter(InfoBanner));
