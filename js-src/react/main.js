import React from 'react';
import ReactDOM from 'react-dom';
import GakuseiNav from './components/gakuseinav';
import GuessPlayPage from './components/guessplaypage';
import AboutPage from './components/aboutpage';
import TranslationPlayPage from './components/translationplaypage';
import NuggetListPage from './components/nuggetlistpage';
import GuessPlaySelection from './components/guessplayselection';
import LandingPage from './components/landingpage'

class App extends React.Component {
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

ReactDOM.render(<App/>, document.getElementById('index_root'));
