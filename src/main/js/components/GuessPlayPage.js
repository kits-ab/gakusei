import React from 'react';
import { connect } from 'react-redux';
import * as Store from '../Store';

import FourAlternativeQuestion from './FourAlternativeQuestion';

const GuessPlayPage = () => <FourAlternativeQuestion pageName="GuessPlayPage" />;

export default connect(
    // Selects which state properties are merged into the component's props
    state => (state.reducer),
    // Selects which action creators are merged into the component's props
    Store.actionCreators
)(GuessPlayPage);
