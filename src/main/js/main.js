import 'react-hot-loader/patch';
import { AppContainer } from 'react-hot-loader';

import '../resources/static/css/custom.css';
import '../resources/static/css/cardflip.css';
import '../resources/static/css/start.css';
import AppProvider from './AppProvider';
import { configureStore, history } from './configureStore';

// Get the application-wide store instance, prepopulating with state from the server where available.
// ! Don't have server-rendering yet, might add later
const initialState = window.initialReduxState;
const store = configureStore(initialState);

const indexRoot = document.getElementById('index_root');

function doRender() {
  ReactDOM.render(
    <AppContainer>
      <AppProvider
        store={store}
        history={history}
      />
    </AppContainer>,
    indexRoot
  );
}

doRender();
if (module.hot) {
  module.hot.accept('./AppProvider', () => {
    doRender();
  });
}
