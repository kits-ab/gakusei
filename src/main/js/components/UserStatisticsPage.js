/* global fetch */

import React from 'react';
import 'whatwg-fetch';

export default class UserStatisticsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { successRate: 0 };
    this.getUserStatistics();
  }
  getUserStatistics() {
    fetch(`api/statistics/${this.props.username}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(data => this.setState({ successRate: data }))
      .catch(ex => console.log('Fel vid hämtning av användarstatistik', ex));
  }
  render() {
    return (
      <div className="text-center">
        <h2>Din totala svarsprocent är {this.state.successRate}%</h2>
      </div>
    );
  }
}

UserStatisticsPage.propTypes = {
  username: React.PropTypes.string.isRequired
};
