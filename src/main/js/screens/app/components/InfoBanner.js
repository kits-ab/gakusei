import Utility from '../../../shared/util/Utility';
import { withRouter } from 'react-router-dom';

import * as Security from '../../../shared/reducers/Security';

export const Reducers = [Security];

export class InfoBanner extends React.Component {
  announcementLanguage(language) {
    let message = null;
    this.props.announcement.map(announcement => {
      if (language === 'sv') {
        message = announcement.text;
      } else if (language === 'en') {
        message = announcement.textEnglish;
      } else if (language === 'jp') {
        message = announcement.textJapan;
      }
    });
    return message;
  }

  render() {
    return (
      <div>
        {this.props.announcement.map((announcement, i) => {
          return (
            announcement.visible && (
              <div
                key={'div' + i}
                className="announcement"
              >
                <p
                  className={'announcementText'}
                  key={i}
                >
                  {this.announcementLanguage('jp')}
                </p>
                <button
                  className={'announcementButton'}
                  onClick={this.props.disableAnnouncement.bind(this, announcement.id)}
                >
                  X
                </button>
              </div>
            )
          );
        })}
      </div>
    );
  }
}

InfoBanner.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

InfoBanner.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);
export default Utility.superConnect(this, Reducers)(withRouter(InfoBanner));
