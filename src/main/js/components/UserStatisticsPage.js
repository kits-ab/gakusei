/* global fetch */

import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'whatwg-fetch';

export default class UserStatisticsPage extends React.Component {
  constructor(props) {
    super(props);

    this.chartOptions = {
      maintainAspectRatio: true,
      legend: {
        onClick: () => { /* Do nothing */
        }
      },
      tooltips: {
        callbacks: {
          label(tooltipItem, data) {
            return `${data.labels[tooltipItem.index]}: ${data.datasets[0].data[tooltipItem.index]}%`;
          }
        }
      }
    };

    this.state = {
      successRate: 0,
      chartData: {
        labels: [
          'Rätt gissningar', 'Totala gissningar'
        ],
        // scales: {   ticks: {     min: 0,     max: 100   } },
        datasets: [
          {
            backgroundColor: [
              'rgba(130,230,130,1.0)', 'rgba(130,170,130,0.4)'
            ],
            // borderColor: 'rgba(130,130,130,0)', borderWidth: 5, hoverBackgroundColor:
            // 'rgba(30,130,130,0.4)', hoverBorderColor: 'rgba(30,130,130,1)',
            data: [0, 100]
          }
        ]
      }
    };

    this.getUserStatistics();
  }
  getUserStatistics() {
    fetch(`api/statistics/${this.props.username}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(data => this.updateData(data))
      .catch(ex => console.log('Fel vid hämtning av användarstatistik', ex));
  }

  updateData(newSuccessRate) {
    this.setState(
      { ...this.state,
        chartData: {
          labels: [
            'Rätt gissningar', 'Totala gissningar'
          ],
          datasets: [
            {
              label: [
                'Rätt gissningar', 'Totala gissningar'
              ],
              backgroundColor: [
                'rgba(130,200,130,1.0)', 'rgba(130,170,130,0.4)'
              ],
              data: [
                newSuccessRate, 100 - newSuccessRate
              ]
            }
          ]
        }
      }
    );
  }

  render() {
    return (
      <div className="text-center">
        <h2>Din totala svarsprocent är {this.state.successRate}%</h2>
        <Pie data={this.state.chartData} options={this.chartOptions} />
      </div>
    );
  }
}

UserStatisticsPage.propTypes = {
  username: React.PropTypes.string.isRequired
};
