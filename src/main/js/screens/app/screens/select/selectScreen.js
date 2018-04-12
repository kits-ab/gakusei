import {
  Button,
  Grid,
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  Panel,
  Badge,
  ProgressBar
} from 'react-bootstrap';

import Utility from '../../../../shared/util/Utility';

import * as Lessons from '../../../../shared/reducers/Lessons';
import * as Security from '../../../../shared/reducers/Security';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay';
import faStar from '@fortawesome/fontawesome-free-solid/faStar';

import ToggleButton from 'react-toggle-button';

export const Reducers = [Lessons, Security];

export class selectScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleLanguageSelection = this.handleLanguageSelection.bind(this);
    this.handleStarredClick = this.handleStarredClick.bind(this);
    this.handleSpacedRepetition = this.handleSpacedRepetition.bind(this);
  }

  componentWillMount() {
    this.props.fetchLessons(this.props.params.type).catch(() => this.props.verifyUserLoggedIn());

    this.props.fetchUserStarredLessons().catch(() => this.props.verifyUserLoggedIn());

    this.props.fetchFavoriteLesson(this.props.params.type).catch(() => this.props.verifyUserLoggedIn());

    this.props.fetchaddressedQuestionsInLessons();

    if (this.props.params.type === 'kanji') {
      this.props.setQuestionLanguage('reading');
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeys);
  }

  // Triggers when we change between play types but remain in "selection" page
  componentWillReceiveProps(nextProps) {
    if (this.props.params.type !== nextProps.params.type) {
      this.props.fetchLessons(nextProps.params.type).catch(() => this.props.verifyUserLoggedIn());
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeys);
  }

  getPageHeader() {
    switch (this.props.params.type) {
      case 'quiz':
        return <h1>Quiz</h1>;
      case 'guess':
        return <h1>Gissa ordet</h1>;
      case 'translate':
        return <h1>Översätt ordet</h1>;
      case 'flashcards':
        return <h1>Bildkort</h1>;
      case 'kanji':
        return <h1>Skriv Kanji</h1>;
      case 'grammar':
        return <h1>Böj verb</h1>;
      default:
        throw new Error('No play type specified');
    }
  }

  getPageDescription() {
    switch (this.props.params.type) {
      case 'quiz':
        return <span>Sätt dina kunskaper om Japan på prov genom att välja en av 4 svarsalternativ</span>;
      case 'guess':
        return <span>Välj mellan 4 svarsalternativ för den korrekta översättningen.</span>;
      case 'translate':
        return <span>Översätt det visade ordet i fritext.</span>;
      case 'flashcards':
        return (
          <span>Träna dig själv genom att använda kort, med frågan på ena sidan och rätta svaret på den andra.</span>
        );
      case 'kanji':
        return <span>Försök rita kanji-tecken med korrekta drag och i rätt ordning.</span>;
      case 'grammar':
        return <span>Böj det visade ordet i fritext på angiven verbform.</span>;
      default:
        throw new Error('No play type specified');
    }
  }

  handleLanguageSelection(event) {
    switch (event.target.name) {
      case 'selectedLesson':
        this.props.setSelectedLesson(event.target.value);
        break;
      case 'questionType':
        this.props.setQuestionLanguage(event.target.value);
        break;
      case 'answerType':
        this.props.setAnswerLanguage(event.target.value);
        break;
      default:
        break;
    }
  }

  startLesson() {
    try {
      this.props.fetchLesson(this.props.params.type).then(() => {
        this.props.setPageByName(`/play/${this.props.params.type}`);
      });
    } catch (err) {
      this.props.verifyUserLoggedIn();
    }
  }

  handleSpacedRepetition() {
    this.props.toggleSpacedRepetition();
  }

  isSpacedRepetition() {
    return this.props.spacedRepetition && this.props.spacedRepetitionModes.includes(this.props.params.type);
  }

  handleStarredClick(lesson) {
    this.props.starredLessons.map(userLesson => userLesson.lesson.name).includes(lesson.name)
      ? this.props.removeStarredLesson(lesson.name)
      : this.props.addStarredLesson(lesson.name);
  }

  getNumberOfQuestions(lesson) {
    if (
      this.props.addressedQuestionsInLessons &&
      this.props.addressedQuestionsInLessons[lesson.name] &&
      this.props.spacedRepetitionModes.includes(this.props.params.type)
    ) {
      const { unanswered, retention, all } = this.props.addressedQuestionsInLessons[lesson.name];
      return { unanswered, retention, all };
    }
    return { unanswered: 0, retention: 0, all: 0 };
  }

  isLessonUnfinished(lesson) {
    if (!this.props.addressedQuestionsInLessons) {
      return false;
    }
    return (
      (this.getNumberOfQuestions(lesson).unanswered < this.getNumberOfQuestions(lesson).all &&
        this.getNumberOfQuestions(lesson).unanswered !== 0) ||
      this.getNumberOfQuestions(lesson).retention > 0
    );
  }

  isLessonUnstarted(lesson) {
    if (!this.props.addressedQuestionsInLessons) {
      return false;
    }

    return this.getNumberOfQuestions(lesson).unanswered === this.getNumberOfQuestions(lesson).all;
  }

  renderLessons(lessons) {
    const mediumColumnSize = 6;
    const largeColumnSize = 4;
    const renderedLessons = lessons.map(lesson => (
      <Col
        key={lesson.name}
        xs={12}
        md={mediumColumnSize}
        lg={largeColumnSize}
      >
        <Panel>
          <Panel.Body>
            <div className={'exercise'}>
              <div className={'exercise__header'}>
                <h3 className={'exercise__header__title'}>
                  {lesson.name}
                  {this.isSpacedRepetition() && this.isLessonUnfinished(lesson) ? (
                    <Badge className="badge--type-todo">{this.getNumberOfQuestions(lesson).retention}</Badge>
                  ) : null}
                  {this.isSpacedRepetition() && this.isLessonUnfinished(lesson) ? (
                    <Badge className="badge--type-new">{this.getNumberOfQuestions(lesson).unanswered}</Badge>
                  ) : null}
                </h3>
                {this.props.params.type === 'quiz' ? null : (
                  <div className={'exercise__header__settings'}>
                    <Button
                      bsClass={
                        this.props.starredLessons.map(userLesson => userLesson.lesson.name).includes(lesson.name)
                          ? 'favorite-icon-button favorite-icon-button--active icon-button'
                          : 'favorite-icon-button icon-button'
                      }
                      onClick={e => {
                        e.stopPropagation();
                        this.handleStarredClick(lesson);
                      }}
                    >
                      <FontAwesomeIcon
                        className={'fa-fw'}
                        icon={faStar}
                      />
                    </Button>
                  </div>
                )}
              </div>
              {this.isSpacedRepetition() && true ? (
                <div className={'exercise__progress'}>
                  <ProgressBar
                    now={
                      100 -
                      (this.getNumberOfQuestions(lesson).retention + this.getNumberOfQuestions(lesson).unanswered) /
                        this.getNumberOfQuestions(lesson).all *
                        100
                    }
                  />
                </div>
              ) : null}
              <p className={'exercise__description'}>{lesson.description}</p>
              <div className={'exercise__actions'}>
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    this.props.setSelectedLesson(lesson);
                    this.startLesson();
                  }}
                  disabled={
                    this.isSpacedRepetition() &&
                    this.getNumberOfQuestions(lesson).unanswered === 0 &&
                    this.getNumberOfQuestions(lesson).retention === 0
                  }
                  bsClass={'icon-button'}
                >
                  <FontAwesomeIcon
                    className={'fa-fw'}
                    icon={faPlay}
                  />
                </Button>
              </div>
            </div>
          </Panel.Body>
        </Panel>
      </Col>
    ));

    const adjustedLessons = [];
    for (let i = 0; i < renderedLessons.length; i++) {
      adjustedLessons.push(renderedLessons[i]);
      if ((i + 1) % (12 / mediumColumnSize) === 0) {
        const fixer = (<div
          key={`clearfix-md ${i}`}
          className="clearfix visible-md"
        />);
        adjustedLessons.push(fixer);
      }

      if ((i + 1) % (12 / largeColumnSize) === 0) {
        const fixer = (<div
          key={`clearfix-lg ${i}`}
          className="clearfix visible-lg"
        />);
        adjustedLessons.push(fixer);
      }
    }
    return adjustedLessons;
  }

  render() {
    let lessonsUnfinished, lessonsFinished, lessonsUnstarted, lessonsAll;
    if (this.isSpacedRepetition()) {
      lessonsUnfinished = this.renderLessons(this.props.lessons.filter(lesson => this.isLessonUnfinished(lesson)));
      lessonsFinished = this.renderLessons(
        this.props.lessons.filter(lesson => !this.isLessonUnfinished(lesson) && !this.isLessonUnstarted(lesson))
      );
      lessonsUnstarted = this.renderLessons(this.props.lessons.filter(lesson => this.isLessonUnstarted(lesson)));
    } else {
      lessonsAll = this.renderLessons(this.props.lessons);
    }

    const favoriteLesson = (
      <Row>
        <Col
          xs={12}
          md={12}
          lg={12}
        >
          <Panel>
            <Panel.Body>
              <div className={'exercise'}>
                <div className={'exercise__header'}>
                  <h3 className={'exercise__header__title'}>
                    {'Blandade frågor.'}
                    {this.isSpacedRepetition() ? <Badge className="badge--type-todo">-1</Badge> : null}
                    {this.isSpacedRepetition() ? <Badge className="badge--type-new">-1</Badge> : null}
                  </h3>
                </div>
                {this.isSpacedRepetition() && true ? (
                  <div className={'exercise__progress'}>
                    <ProgressBar now={0} />
                  </div>
                ) : null}
                <p className={'exercise__description'}>
                  {'Blandade frågor från alla dina favoritmarkerade lektioner.'}
                </p>
                <div className={'exercise__actions'}>
                  <Button
                    onClick={e => {
                      e.stopPropagation();
                      this.props.setSelectedLesson(this.props.favoriteLesson);
                      this.startLesson();
                    }}
                    disabled={this.props.starredLessons.length === 0}
                    bsClass={'icon-button'}
                  >
                    <FontAwesomeIcon
                      className={'fa-fw'}
                      icon={faPlay}
                    />
                  </Button>
                </div>
              </div>
            </Panel.Body>
          </Panel>
        </Col>
      </Row>
    );

    const answerLanguages = [];
    let questionLanguages = [];
    answerLanguages.push(
      <option
        key={'reading'}
        value={'reading'}
      >
        Japanska
      </option>
    );
    answerLanguages.push(
      <option
        key={'swedish'}
        value={'swedish'}
      >
        Svenska
      </option>
    );
    /* devcode: start */
    answerLanguages.push(
      <option
        key={'english'}
        value={'english'}
      >
        Engelska
      </option>
    );
    /* devcode: end */

    if (this.props.params.type === 'kanji') {
      questionLanguages = answerLanguages.shift();
    } else {
      questionLanguages = answerLanguages;
    }

    let languageSelection;
    if (this.props.params.type === 'quiz' || this.props.params.type === 'grammar') {
      languageSelection = <div />;
    } else {
      languageSelection = (
        <FormGroup>
          <Row>
            <Col
              xs={12}
              sm={4}
            >
              <HelpBlock>Frågespråk</HelpBlock>
              <FormControl
                componentClass="select"
                name="questionType"
                id="questionLanguageSelection"
                onChange={this.handleLanguageSelection}
                value={this.props.questionType}
                disabled={this.props.params.type === 'kanji'}
              >
                {questionLanguages}
              </FormControl>
            </Col>
            <Col
              xs={12}
              sm={4}
            >
              <HelpBlock>Svarspråk</HelpBlock>
              <FormControl
                componentClass="select"
                name="answerType"
                id="answerLanguageSelection"
                onChange={this.handleLanguageSelection}
                value={this.props.answerType}
              >
                {answerLanguages}
              </FormControl>
            </Col>
            <Col
              xs={12}
              sm={4}
            >
              <HelpBlock>Smart inlärningsläge</HelpBlock>
              <ToggleButton
                inactiveLabel={'Av'}
                activeLabel={'På'}
                value={this.isSpacedRepetition()}
                onToggle={this.handleSpacedRepetition}
              />
            </Col>
          </Row>
        </FormGroup>
      );
    }
    return (
      <Grid>
        <Col
          xs={11}
          lg={8}
          lgOffset={2}
        >
          <ControlLabel>{this.getPageHeader()}</ControlLabel>
          <FormGroup>
            <ControlLabel>{this.getPageDescription()}</ControlLabel>
          </FormGroup>
          {this.props.params.type !== 'quiz' && this.props.params.type !== 'grammar' ? (
            <FormGroup>
              <HelpBlock> Gemensamt lektionsläge för dina favoritlektioner </HelpBlock>
              {favoriteLesson}
            </FormGroup>
          ) : null}
          {this.isSpacedRepetition() ? (
            <FormGroup>
              <HelpBlock> Pågående lektioner </HelpBlock>
              <Row>{lessonsUnfinished}</Row>
              <hr />
              <HelpBlock> Ej påbörjade lektioner </HelpBlock>
              <Row>{lessonsUnstarted}</Row>
              <hr />
              <HelpBlock> Färdiga lektioner </HelpBlock>
              <Row>{lessonsFinished}</Row>
              <hr />
            </FormGroup>
          ) : (
            <FormGroup>
              <HelpBlock> Välj lektion att starta </HelpBlock>
              <Row>{lessonsAll}</Row>
            </FormGroup>
          )}
          {languageSelection}
          <br />
        </Col>
      </Grid>
    );
  }
}

selectScreen.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

selectScreen.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

export default Utility.superConnect(this, Reducers)(selectScreen);
