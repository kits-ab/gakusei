import React from 'react';
import { Grid, Row, Col, ListGroup, ListGroupItem, ProgressBar } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';

import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/stores/Lessons';
import * as Security from '../../../../shared/stores/Security';

export const Reducers = [Lessons, Security];

export class homeScreen extends React.Component {
  static getChartOptions() {
    return {
      responsive: true,
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
    this.props.fetchUserStarredLessons();
    this.props.fetchaddressedQuestionsInLessons();
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
    if (this.props.addressedQuestionsInLessons) {
      const starredLessons = this.props.starredLessons.map((userLesson) => {
        const now = (((this.props.addressedQuestionsInLessons[userLesson.lesson.name][1] -
          this.props.addressedQuestionsInLessons[userLesson.lesson.name][0])
          / this.props.addressedQuestionsInLessons[userLesson.lesson.name][1]) * 100).toFixed();
        return (
          <ListGroupItem
            key={userLesson.lesson.name}
          >
            {userLesson.lesson.name} (totalt {this.props.addressedQuestionsInLessons[userLesson.lesson.name][1]} st)
            <ProgressBar now={parseInt(now, 10)} label={`${now}%`} />
          </ListGroupItem>);
      });
      return (
        <Grid className="text-center">
          <h2>Välkommen till Gakusei {this.props.loggedInUser}!</h2>
          <h3>Din svarsstatistik:</h3>
          <Row>
            <Col xs={12} xsOffset={0} md={6} mdOffset={3}>
              { this.props.requestingSuccessRate === false ?
                <Pie data={this.getChartData()} options={homeScreen.getChartOptions()}/> :
                <p>Loading...</p> }
            </Col>
          </Row>
          <h3>Lektioner du följer och andel behandlade frågor i varje lektion:</h3>
          <ListGroup>
            {starredLessons}
          </ListGroup>
        </Grid>
      );
    }
    return null;
  }
}

homeScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

homeScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);


export default Utility.superConnect(this, Reducers)(homeScreen);

