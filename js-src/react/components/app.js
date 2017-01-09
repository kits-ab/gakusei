import React from 'react';
import GakuseiNav from './gakuseinav';
import GuessPlayPage from './guessplaypage';
import AboutPage from './aboutpage';
import TranslationPlayPage from './translationplaypage';
import NuggetListPage from './nuggetlistpage';
import GuessPlaySelection from './guessplayselection';
import LandingPage from './landingpage'

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.switchPage = this.switchPage.bind(this);
        this.state = {
            currentPage : <LandingPage/>
        }
    }
    switchPage(newContent, selectedLesson) {
        if (newContent === 'GuessPlayPageSelection') {
            this.setState({currentPage : <GuessPlaySelection switchPage={this.switchPage}/>
            });
        }
        else if (newContent === 'GuessPlayPage') {
            this.setState({
                currentPage: <GuessPlayPage selectedLesson={selectedLesson}
                                            switchPage={this.switchPage}/>
            });
        }
        else if (newContent === 'TranslationPlayPage') {
            this.setState({currentPage : <TranslationPlayPage/>})
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