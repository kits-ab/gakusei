/* global fetch */

import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'whatwg-fetch';

import { connect } from 'react-redux';
import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/stores/Lessons';
import * as Security from '../../../../shared/stores/Security';

export const Reducers = [Lessons, Security];

export class profileScreen extends React.Component {
  static getChartOptions() {
    return {
      maintainAspectRatio: true,
      legend: {
        onClick: () => { /* Do nothing */ }
      },
      tooltips: {
        callbacks: {
          label(tooltipItem, data) {
            return `${data.labels[tooltipItem.index]}: ${data.datasets[0].data[tooltipItem.index]}%`;
          }
        }
      }
    };
  }

  constructor(props) {
    super(props);

    this.getChartData = this.getChartData.bind(this);
  }

  componentWillMount() {
    this.props.fetchUserSuccessRate(this.props.loggedInUser);
  }

  getChartData() {
    const theLabels = [
      'Andel rätt svar', 'Andel fel svar'
    ];

    return {
      labels: theLabels,
      datasets: [
        {
          label: theLabels,
          backgroundColor: [
            'rgba(130,200,130,1.0)', 'rgba(130,170,130,0.4)'
          ],
          data: [
            this.props.successRate, 100 - this.props.successRate
          ]
        }
      ]
    };
  }

  render() {
    return (
      <div className="text-center">
        <h2>Spelarstatistik</h2>
        { this.props.requestingSuccessRate === false ?
          <Pie data={this.getChartData()} options={profileScreen.getChartOptions()} /> :
          <p>Loading...</p> }
      </div>
    );
  }
}

profileScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

profileScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);

// Wire up the React component to the Redux store and export it when importing this file
export default Utility.superConnect(this, Reducers)(profileScreen);

