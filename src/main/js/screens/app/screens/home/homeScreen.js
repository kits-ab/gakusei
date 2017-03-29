import React from 'react';
import { Grid, Row, Col, ListGroup, ListGroupItem, ProgressBar } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';

import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/reducers/Lessons';
import * as Security from '../../../../shared/reducers/Security';

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
      'Andel rätt svar!', 'Andel fel svar'
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

  setLessonAndGo(lesson, format = 'guess') {
    this.props.setSelectedLesson(lesson);
    this.props.setPageByName(`/select/${format}`);
  }

  showFavorites() {
    const headerText = 'Dina favoritlektioner';

    if (this.props.starredLessons.length > 0 && this.props.addressedQuestionsInLessons) {
      const starredLessons = this.props.starredLessons.map((userLesson) => {
        if (userLesson.lesson.description !== 'quiz') {
          const totalWordCount = this.props.addressedQuestionsInLessons[userLesson.lesson.name][1];
          const completeCount = ((this.props.addressedQuestionsInLessons[userLesson.lesson.name][1] -
            this.props.addressedQuestionsInLessons[userLesson.lesson.name][0])
            / this.props.addressedQuestionsInLessons[userLesson.lesson.name][1]);
          const completePercentage = ((completeCount / totalWordCount) * 100).toFixed();
          return (
            <ListGroupItem
              header={`${userLesson.lesson.name}`}
              key={userLesson.lesson.name}
              onClick={() => this.setLessonAndGo(userLesson.lesson)}
            >
              <ProgressBar now={parseInt(completePercentage, 10)} label={`${completePercentage}% avklarat`} srOnly />
              Du har klarat {completeCount} av {totalWordCount} ord
            </ListGroupItem>);
        }
        return (
          <ListGroupItem
            header={`Quiz: ${userLesson.lesson.name}`}
            key={userLesson.lesson.name}
            onClick={() => this.setLessonAndGo(userLesson.lesson, 'quiz')}
          >
            <span />
            <ProgressBar bsStyle="warning" now={100} srOnly />
          </ListGroupItem>);
      });

      return (<div><h3>{headerText}</h3>
        <ListGroup>
          {starredLessons}
        </ListGroup></div>);
    }
    return (<div>
      <h3>{headerText}</h3>
      <p>Navigera till speltyperna i menyn för att lägga till lektioner här.</p>
    </div>);
  }

  render() {
    return (
      <Grid className="text-center">
        <h2 name="greeter">Välkommen till Gakusei, {this.props.loggedInUser}!</h2>
        <h3>Din svarsstatistik:</h3>
        <Row>
          <Col xs={12} xsOffset={0} md={6} mdOffset={3}>
            { this.props.requestingSuccessRate === false ?
              <Pie data={this.getChartData()} options={homeScreen.getChartOptions()} /> :
              <p>Loading...</p> }
          </Col>
        </Row>
        {this.showFavorites()}
      </Grid>
    );
  }
}

homeScreen.defaultProps = Utility.reduxEnabledDefaultProps({

}, Reducers);

homeScreen.propTypes = Utility.reduxEnabledPropTypes({

}, Reducers);

export default Utility.superConnect(this, Reducers)(homeScreen);

