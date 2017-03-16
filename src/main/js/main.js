import 'react-hot-loader/patch';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppProvider from './AppProvider';

const indexRoot = document.getElementById('index_root');

const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
  indexRoot
  );

render(AppProvider);

if (module.hot) module.hot.accept('./AppProvider', () => render(AppProvider));
