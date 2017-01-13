import React from 'react';
import GakuseiNav from './gakuseinav';
import GuessPlayPage from './guessplaypage';
import AboutPage from './aboutpage';
import TranslationPlayPage from './translationplaypage';
import NuggetListPage from './nuggetlistpage';
import LessonSelection from './lessonselection';
import LandingPage from './landingpage';
import EndScreenPage from './endscreenpage';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.switchPage = this.switchPage.bind(this);
        this.state = {
            currentPage : <LandingPage/>
        }
    }
    switchPage(newContent, selectedLesson, gamemode) {
        if (newContent === 'LessonSelection') {
            this.setState({currentPage : <LessonSelection switchPage={this.switchPage}
            gamemode={gamemode}/>
            });
        }
        else if (newContent === 'GuessPlayPage') {
            this.setState({
                currentPage: <GuessPlayPage selectedLesson={selectedLesson}
                                            switchPage={this.switchPage}/>
            });
        }
        else if (newContent === 'TranslationPlayPage') {
            this.setState({currentPage : <TranslationPlayPage switchPage={this.switchPage}/>})
        }
        else if (newContent === 'NuggetListPage') {
            this.setState({currentPage : <NuggetListPage/>})
        }
        else if (newContent === 'AboutPage') {
            this.setState({currentPage : <AboutPage/>})
        }
        else if (newContent === 'LandingPage') {
            this.setState({currentPage : <LandingPage/>})
        }
        else if (newContent === 'EndScreenPage'){
            this.setState({currentPage: <EndScreenPage switchPage={this.switchPage}
            gamemode={gamemode}/>});
        }
    }
    render() {
        return (
            <div>
                <GakuseiNav updater={this.switchPage} />
                {this.state.currentPage}
            </div>
        );
    }
}
