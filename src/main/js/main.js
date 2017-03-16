import 'react-hot-loader/patch';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppProvider from './AppProvider';

ReactDOM.render(
  <AppContainer>
    <AppProvider />
  </AppContainer>,
  document.getElementById('index_root'));

/*if (module.hot) {
  module.hot.accept('./AppProvider', () => {
    const NewAppProvider = require('./AppProvider').default;
    ReactDOM.render(
      <AppContainer>
        <AppProvider />
      </AppContainer>,
            document.getElementById('index_root')
        );
  });
}*/
