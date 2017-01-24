import React from 'react';
import GakuseiNav from './gakuseinav';
import GuessPlayPage from './guessplaypage';
import AboutPage from './aboutpage';
import TranslationPlayPage from './translationplaypage';
import NuggetListPage from './nuggetlistpage';
import LessonSelection from './lessonselection';
import LandingPage from './landingpage';
import EndScreenPage from './endscreenpage';
import 'whatwg-fetch';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.switchPage = this.switchPage.bind(this);
        this.state = {
            currentPage : <LandingPage/>
        };
    }
    setLoggedInUser() {
      fetch('/username', {credentials: 'same-origin'})
        .then(response => response.text())
        .then(user => this.setState({loggedInUser: user}));
    }
    componentDidMount() {
        this.setLoggedInUser();
    }
    switchPage(newContent, props) {
        props = Object.assign(
          {
            switchPage: this.switchPage,
            username: this.state.loggedInUser
          },
          props);
        const pages = {
            'LessonSelection'           : <LessonSelection {...props}/>,
            'GuessPlayPage'             : <GuessPlayPage {...props}/>,
            'TranslationPlayPage'       : <TranslationPlayPage/>,
            'NuggetListPage'            : <NuggetListPage/>,
            'AboutPage'                 : <AboutPage/>,
            'EndScreenPage'             : <EndScreenPage {...props}/>,
            'LandingPage'               : <LandingPage/>
        };
        this.setState({currentPage : pages[newContent]});
    }
    render() {
        return (
            <div>
                <GakuseiNav updater={this.switchPage} username={this.state.loggedInUser}/>
                {this.state.currentPage}
            </div>
        );
    }
}
