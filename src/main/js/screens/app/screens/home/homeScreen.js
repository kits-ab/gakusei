import { Grid, Row, Col, ListGroup, ListGroupItem, ProgressBar } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';

import Utility from '../../../../shared/util/Utility';
import * as Lessons from '../../../../shared/reducers/Lessons';
import * as Security from '../../../../shared/reducers/Security';
import { loginScreen } from '../login/loginScreen';
import { translate } from 'react-i18next';

export const Reducers = [Lessons, Security];

export class homeScreen extends React.Component {
  static getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        onClick: () => {
          /* Do nothing */
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
    const theLabels = ['{t("homeScreen.rightAnswer")}', '{t("homeScreen.wrongAnswer")}'];

    return {
      labels: theLabels,
      datasets: [
        {
          label: theLabels,
          backgroundColor: ['rgba(130,200,130,1.0)', 'rgba(130,170,130,0.4)'],
          data: [this.props.successRate, 100 - this.props.successRate]
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
      const starredLessons = this.props.starredLessons.map(userLesson => {
        if (userLesson.lesson.description !== 'quiz') {
          const totalNuggetCount = this.props.addressedQuestionsInLessons[userLesson.lesson.name].all;
          const completeNuggetCount = this.props.addressedQuestionsInLessons[userLesson.lesson.name].correctlyAnswered;
          const completeNuggetPercentage = ((completeNuggetCount / totalNuggetCount) * 100).toFixed();
          return (
            <ListGroupItem
              key={userLesson.lesson.name}
              onClick={() => this.setLessonAndGo(userLesson.lesson)}
            >
              <h4>{userLesson.lesson.name}</h4>
              <ProgressBar
                now={parseInt(completeNuggetPercentage, 10)}
                label={`${completeNuggetPercentage}% avklarat`}
                srOnly
              />
              Du har klarat {completeNuggetCount} av {totalNuggetCount} ord
            </ListGroupItem>
          );
        }
        return (
          <ListGroupItem
            key={userLesson.lesson.name}
            onClick={() => this.setLessonAndGo(userLesson.lesson, 'quiz')}
          >
            <h4>Quiz: {userLesson.lesson.name}</h4>
            <ProgressBar
              bsStyle="warning"
              now={100}
              srOnly
            />
          </ListGroupItem>
        );
      });

      return (
        <div>
          <h3>{headerText}</h3>
          <ListGroup>{starredLessons}</ListGroup>
        </div>
      );
    }
    return (
      <div>
        <h3>{headerText}</h3>
        <p>Navigera till speltyperna i menyn för att lägga till lektioner här.</p>
      </div>
    );
  }

  render() {
    const { t, i18n } = this.props;

    return (
      <Grid className="text-center">
        <h2 name="greeter">Välkommen, {this.props.loggedInUser}!</h2>
        {this.showFavorites()}
        <h3>Din svarsstatistik:</h3>
        <Row>
          <Col
            xs={12}
            md={6}
            mdOffset={3}
          >
            {this.props.requestingSuccessRate === false ? (
              <Pie
                data={this.getChartData()}
                options={homeScreen.getChartOptions()}
              />
            ) : (
              <p>Loading...</p>
            )}
          </Col>
        </Row>
      </Grid>
    );
  }
}

homeScreen.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

homeScreen.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

export default translate('translations')(Utility.superConnect(this, Reducers)(homeScreen));
