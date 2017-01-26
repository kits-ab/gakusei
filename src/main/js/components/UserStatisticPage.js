/* global fetch*/

import React from 'react';
import 'whatwg-fetch';

export default class UserStatisticPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { successRate: 0 };
  }
  getUserStatistics() {
    fetch(`api/statistics/${this.props.username}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(json => this.setState({ successRate: json.successRate }))
      .catch(ex => console.log('Fel vid hämtning av användarstatistik', ex));
  }
  render() {
    this.getUserStatistics();
    return (
      <div className="text-center">
        <h2>Din totala svarsprocent är {this.state.successRate}%</h2>
      </div>
    );
  }
}

UserStatisticPage.propTypes = {
  username: React.PropTypes.string.isRequired
};
