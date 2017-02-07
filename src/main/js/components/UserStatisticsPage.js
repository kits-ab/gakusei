/* global fetch */

import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'whatwg-fetch';

export default class UserStatisticsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      successRate: 0,
      chartData: {
        labels: [
          'Rätt gissningar',
          'Totala gissningar'
        ],
      // scales: {
      //   ticks: {
      //     min: 0,
      //     max: 100
      //   }
      // },
        datasets: [{
          label: ['My First dataset', 'something more'],
          backgroundColor: ['rgba(130,230,130,1.0)', 'rgba(130,170,130,0.4)'],
          borderColor: 'rgba(130,130,130,1)',
          borderWidth: 0,
          hoverBackgroundColor: 'rgba(30,130,130,0.4)',
          hoverBorderColor: 'rgba(30,130,130,1)',
          data: [
            0,
            100
          ]
        }]
      }
    };

    this.getUserStatistics();
  }
  getUserStatistics() {
    fetch(`api/statistics/${this.props.username}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(data => this.updateData(data))
      .catch(ex => console.log('Fel vid hämtning av användarstatistik', ex));

    // fetch(`api/statistics/${this.props.username}`, { credentials: 'same-origin' })
    //   .then(response => response.json())
    //   .then(data => this.updateSuccessRate(data))
    //   .catch(ex => console.log('Fel vid hämtning av användarstatistik', ex));
  }

  updateData(newSuccessRate) {
    this.setState({
      successRate: newSuccessRate,
      chartData: {
        labels: [
          'Rätt gissningar',
          'Totala gissningar'
        ],
      // scales: {
      //   ticks: {
      //     min: 0,
      //     max: 100
      //   }
      // },
        datasets: [{
          label: ['My First dataset', 'something more'],
          backgroundColor: ['rgba(130,230,130,1.0)', 'rgba(130,170,130,0.4)'],
          borderColor: 'rgba(130,130,130,1)',
          borderWidth: 0,
          hoverBackgroundColor: 'rgba(30,130,130,0.4)',
          hoverBorderColor: 'rgba(30,130,130,1)',
          data: [
            newSuccessRate,
            100
          ]
        }]
      }
    });
  }

  render() {
    return (
      <div className="text-center">
        <h2>Din totala svarsprocent är {this.state.successRate}%</h2>
        <Pie
          data={this.state.chartData}
          // width={100}
          // height={0}
          options={{
            maintainAspectRatio: true,
            legend: {
              onClick: () => { /* Do nothing */ }
            }
          }}
        />
      </div>
    );
  }
}

UserStatisticsPage.propTypes = {
  username: React.PropTypes.string.isRequired
};
