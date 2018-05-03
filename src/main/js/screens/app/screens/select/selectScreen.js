import { Button, Grid, Row, Col, FormGroup, ControlLabel, Panel, Badge, ProgressBar, Radio } from 'react-bootstrap';

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
    this.handleStarredClick = this.handleStarredClick.bind(this);
    this.handleSpacedRepetition = this.handleSpacedRepetition.bind(this);
  }

  componentDidMount() {
    this.props.fetchLessons(this.props.match.params.type).catch(() => this.props.verifyUserLoggedIn());

    this.props.fetchUserStarredLessons().catch(() => this.props.verifyUserLoggedIn());

    this.props.fetchFavoriteLesson(this.props.match.params.type).catch(() => this.props.verifyUserLoggedIn());

    this.props.fetchaddressedQuestionsInLessons();

    if (this.props.match.params.type === 'kanji') {
      this.props.setQuestionLanguage('reading');
    }
  }

  // Triggers when we change between play types but remain in "selection" page
  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.type !== nextProps.match.params.type) {
      this.props.fetchLessons(nextProps.match.params.type).catch(() => this.props.verifyUserLoggedIn());
    }
  }

  getPageHeader() {
    switch (this.props.match.params.type) {
      case 'quiz':
        return 'Quiz';
      case 'guess':
        return 'Gissa ordet';
      case 'translate':
        return 'Översätt ordet';
      case 'flashcards':
        return 'Bildkort';
      case 'kanji':
        return 'Skriv Kanji';
      case 'grammar':
        return 'Böj verb';
      default:
        throw new Error('No play type specified');
    }
  }

  getPageDescription() {
    switch (this.props.match.params.type) {
      case 'quiz':
        return 'Sätt dina kunskaper om Japan på prov genom att välja en av 4 svarsalternativ';
      case 'guess':
        return 'Välj mellan 4 svarsalternativ för den korrekta översättningen.';
      case 'translate':
        return 'Översätt det visade ordet i fritext.';
      case 'flashcards':
        return 'Träna dig själv genom att använda kort, med frågan på ena sidan och rätta svaret på den andra.';
      case 'kanji':
        return 'Försök rita kanji-tecken med korrekta drag och i rätt ordning.';
      case 'grammar':
        return 'Böj det visade ordet i fritext på angiven verbform.';
      default:
        throw new Error('No play type specified');
    }
  }

  startLesson() {
    try {
      this.props.fetchLesson(this.props.match.params.type).then(() => {
        this.props.setPageByName(`/play/${this.props.match.params.type}`);
      });
    } catch (err) {
      this.props.verifyUserLoggedIn();
    }
  }

  handleSpacedRepetition() {
    this.props.toggleSpacedRepetition();
  }

  isSpacedRepetition() {
    return this.props.spacedRepetition && this.props.spacedRepetitionModes.includes(this.props.match.params.type);
  }

  handleStarredClick(lesson) {
    this.props.starredLessons.map(userLesson => userLesson.lesson.name).includes(lesson.name)
      ? this.props.removeStarredLesson(lesson.name, this.props.match.params.type)
      : this.props.addStarredLesson(lesson.name, this.props.match.params.type);
  }

  getNumberOfRetentionQuestions(lesson) {
    if (
      this.props.addressedQuestionsInLessons &&
      this.props.addressedQuestionsInLessons[lesson.name] &&
      this.props.spacedRepetitionModes.includes(this.props.match.params.type)
    ) {
      return this.props.addressedQuestionsInLessons[lesson.name];
    }
    return { unanswered: 0, retention: 0, all: 0 };
  }

  getNumberOfFavoriteQuestions() {
    if (
      this.props.favoriteLesson &&
      this.props.favoriteLesson.nuggetData &&
      this.props.spacedRepetitionModes.includes(this.props.match.params.type)
    ) {
      return this.props.favoriteLesson.nuggetData;
    }
    return { unanswered: 0, retention: 0, all: 0 };
  }

  isLessonFinished(lesson) {
    if (!this.props.addressedQuestionsInLessons) {
      return false;
    }
    return (
      this.getNumberOfRetentionQuestions(lesson).unanswered === 0 &&
      this.getNumberOfRetentionQuestions(lesson).retention === 0
    );
  }

  isLessonStarted(lesson) {
    if (!this.props.addressedQuestionsInLessons) {
      return true;
    }

    return !(this.getNumberOfRetentionQuestions(lesson).unanswered === this.getNumberOfRetentionQuestions(lesson).all);
  }

  isLessonStarred(lesson) {
    return this.props.starredLessons.filter(starred => starred.lesson.id === lesson.id).length > 0;
  }

  getLessons(lessons) {
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
                <h3 className={'exercise__title'}>
                  {lesson.name}
                  {this.isSpacedRepetition() &&
                  !this.isLessonFinished(lesson) &&
                  this.getNumberOfRetentionQuestions(lesson).retention > 0 ? (
                      <Badge className="badge--type-todo">{this.getNumberOfRetentionQuestions(lesson).retention}</Badge>
                    ) : null}
                  {this.isSpacedRepetition() &&
                  !this.isLessonFinished(lesson) &&
                  this.getNumberOfRetentionQuestions(lesson).unanswered > 0 ? (
                      <Badge className="badge--type-new">{this.getNumberOfRetentionQuestions(lesson).unanswered}</Badge>
                    ) : null}
                </h3>
                {this.props.match.params.type === 'quiz' ? null : (
                  <div>
                    <Button
                      bsClass={
                        this.props.starredLessons.map(userLesson => userLesson.lesson.name).includes(lesson.name)
                          ? 'toggle-icon-button toggle-icon-button--active'
                          : 'toggle-icon-button'
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
              {this.isSpacedRepetition() ? (
                <div className={'exercise__progress'}>
                  <ProgressBar
                    now={
                      100 -
                      (this.getNumberOfRetentionQuestions(lesson).retention +
                        this.getNumberOfRetentionQuestions(lesson).unanswered) /
                        this.getNumberOfRetentionQuestions(lesson).all *
                        100
                    }
                  />
                </div>
              ) : (
                <div className={'exercise__progress'}>
                  <ProgressBar
                    now={
                      this.props.addressedQuestionsInLessons &&
                      Object.keys(this.props.addressedQuestionsInLessons).length > 0
                        ? parseInt(
                          (
                            this.props.addressedQuestionsInLessons[lesson.name].correctlyAnswered /
                              this.props.addressedQuestionsInLessons[lesson.name].all *
                              100
                          ).toFixed(),
                          10
                        )
                        : 0
                    }
                  />
                </div>
              )}
              <p className={'exercise__description'}>{lesson.description}</p>
              <div className={'exercise__actions'}>
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    this.props.setSelectedLesson(lesson);
                    this.startLesson();
                  }}
                  disabled={this.isSpacedRepetition() && this.isLessonFinished(lesson) && this.isLessonStarted(lesson)}
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
    return adjustedLessons ? <Row>{adjustedLessons}</Row> : null;
  }

  getLanguageSelection() {
    const RadioLanguage = props => {
      const setLanguage = (questionLanguage, answerLanguage) => {
        this.props.setQuestionLanguage(questionLanguage);
        this.props.setAnswerLanguage(answerLanguage);
      };

      return (
        <Radio
          onChange={() => setLanguage(props.languageQuestion.id, props.languageAnswer.id)}
          name={props.name}
          checked={
            props.languageQuestion.id === this.props.questionType && props.languageAnswer.id === this.props.answerType
          }
        >
          {props.languageQuestion.text}
          <span> → </span>
          {props.languageAnswer.text}
        </Radio>
      );
    };

    if (this.props.match.params.type === 'quiz' || this.props.match.params.type === 'grammar') {
      return null;
    } else {
      return this.props.spacedRepetitionModes.includes(this.props.match.params.type) ? (
        <FormGroup>
          <FormGroup controlId="languageSelect">
            <RadioLanguage
              key={'reading'}
              name={'languageSelect'}
              languageQuestion={{ id: 'reading', text: 'Japanska' }}
              languageAnswer={{ id: 'swedish', text: 'Svenska' }}
            />
            <RadioLanguage
              key={'swedish'}
              name={'languageSelect'}
              languageQuestion={{ id: 'swedish', text: 'Svenska' }}
              languageAnswer={{ id: 'reading', text: 'Japanska' }}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Smart inlärningsläge</ControlLabel>
            <ToggleButton
              inactiveLabel={'Av'}
              activeLabel={'På'}
              value={this.isSpacedRepetition()}
              onToggle={this.handleSpacedRepetition}
            />
          </FormGroup>
        </FormGroup>
      ) : null;
    }
  }

  getKanjiSettingsSelection() {
    return this.props.match.params.type === 'kanji' ? (
      <FormGroup>
        <FormGroup controlId="difficultySelect">
          <Radio
            key={'easy'}
            name={'difficultySelect'}
            onChange={() => this.props.setKanjiDifficulty('easy')}
            checked={this.props.kanjiDifficulty === 'easy'}
          >
            Enkelt - Följ en bana
          </Radio>
          <Radio
            key={'medium'}
            name={'difficultySelect'}
            onChange={() => this.props.setKanjiDifficulty('medium')}
            checked={this.props.kanjiDifficulty === 'medium'}
          >
            Medium - Rita med hjälp
          </Radio>
          <Radio
            key={'hard'}
            name={'difficultySelect'}
            onChange={() => this.props.setKanjiDifficulty('hard')}
            checked={this.props.kanjiDifficulty === 'hard'}
          >
            Svårt - Rita på frihand
          </Radio>
        </FormGroup>
      </FormGroup>
    ) : null;
  }

  render() {
    let lessonsFavorite, lessonsFavoriteDone, lessonsNotFavorite;
    if (this.isSpacedRepetition()) {
      lessonsFavorite = this.getLessons(
        this.props.lessons.filter(lesson => this.isLessonStarred(lesson) && !this.isLessonFinished(lesson))
      );
      lessonsFavoriteDone = this.getLessons(
        this.props.lessons.filter(lesson => this.isLessonStarred(lesson) && this.isLessonFinished(lesson))
      );
      lessonsNotFavorite = this.getLessons(this.props.lessons.filter(lesson => !this.isLessonStarred(lesson)));
    } else {
      lessonsFavorite = this.getLessons(this.props.lessons.filter(lesson => this.isLessonStarred(lesson)));
      lessonsNotFavorite = this.getLessons(this.props.lessons.filter(lesson => !this.isLessonStarred(lesson)));
      lessonsFavoriteDone = undefined;
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
                    {this.isSpacedRepetition() && this.getNumberOfFavoriteQuestions().retention > 0 ? (
                      <Badge className="badge--type-todo">{this.getNumberOfFavoriteQuestions().retention}</Badge>
                    ) : null}
                    {this.isSpacedRepetition() && this.getNumberOfFavoriteQuestions().unanswered > 0 ? (
                      <Badge className="badge--type-new">{this.getNumberOfFavoriteQuestions().unanswered}</Badge>
                    ) : null}
                  </h3>
                </div>
                {this.isSpacedRepetition() ? (
                  <div className={'exercise__progress'}>
                    <ProgressBar
                      now={
                        this.getNumberOfFavoriteQuestions().all > 0
                          ? 100 -
                            (this.getNumberOfFavoriteQuestions().retention +
                              this.getNumberOfFavoriteQuestions().unanswered) /
                              this.getNumberOfFavoriteQuestions().all *
                              100
                          : 0
                      }
                    />
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

    return (
      <Grid>
        <Col>
          <h1>{this.getPageHeader()}</h1>
          <p>{this.getPageDescription()}</p>
          {this.getLanguageSelection()}
          {this.getKanjiSettingsSelection()}
          <h2>Lektioner</h2>
          {!['quiz', 'grammar', 'kanji'].includes(this.props.match.params.type) ? favoriteLesson : null}

          <div>
            {lessonsFavorite ? (
              <div>
                <h3>Pågående lektioner</h3> {lessonsFavorite}
              </div>
            ) : null}
            {lessonsFavoriteDone ? (
              <div>
                <h3>Färdiga lektioner</h3> {lessonsFavoriteDone}
              </div>
            ) : null}
            {lessonsNotFavorite ? (
              <div>
                <h3>Övriga lektioner</h3> {lessonsNotFavorite}
              </div>
            ) : null}
          </div>
        </Col>
      </Grid>
    );
  }
}

selectScreen.defaultProps = Utility.reduxEnabledDefaultProps({}, Reducers);

selectScreen.propTypes = Utility.reduxEnabledPropTypes({}, Reducers);

export default Utility.superConnect(this, Reducers)(selectScreen);
