import 'react-hot-loader/patch';
import { AppContainer } from 'react-hot-loader';

import '../resources/static/css/style.scss';
import AppProvider from './AppProvider';
import { configureStore, history } from './configureStore';

import { I18nextProvider, translate } from 'react-i18next';
import i18n from './shared/i18n';
import Utility from './shared/util/Utility';
import { Reducers } from './screens/app/components/GakuseiNav';
import AppScreen from './screens/app';

// Get the application-wide store instance, prepopulating with state from the server where available.
// ! Don't have server-rendering yet, might add later
const initialState = window.initialReduxState;
const store = configureStore(initialState);

const indexRoot = document.getElementById('index_root');

function doRender() {
  ReactDOM.render(
    <I18nextProvider i18n={i18n}>
      <AppContainer>
        <AppProvider
          store={store}
          history={history}
        />
      </AppContainer>
    </I18nextProvider>,
    indexRoot
  );
}

doRender();
if (module.hot) {
  module.hot.accept('./AppProvider', () => {
    doRender();
  });
}
