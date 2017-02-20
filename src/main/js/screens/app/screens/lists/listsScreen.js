/* global fetch */

import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import 'whatwg-fetch';
import NuggetList from './components/NuggetList';
import QueryInput from './components/QueryInput';

export default class listsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wordType: '',
      factType1: '',
      factType2: '',
      factType3: '',
      factType4: '',
      nuggetList: []
    };
    this.updateQueryInput = this.updateQueryInput.bind(this);
    this.fetchCustomQuery = this.fetchCustomQuery.bind(this);
  }
  updateQueryInput(event) {
    if (event.target.id === 'kanjiFactType') {
      this.setState({
        factType1: event.target.checked ? 'kanji' : ''
      });
    } else if (event.target.id === 'readingFactType') {
      this.setState({
        factType2: event.target.checked ? 'reading' : ''
      });
    } else if (event.target.id === 'writingFactType') {
      this.setState({
        factType3: event.target.checked ? 'writing' : ''
      });
    } else if (event.target.id === 'swedishFactType') {
      this.setState({
        factType4: event.target.checked ? 'swedish' : ''
      });
    } else if (event.target.id === 'wordType') {
      this.setState({ wordType: event.target.value });
    }
  }
  fetchCustomQuery(event) {
    const fetchUrl = `/api/filter/nuggets?wordType=${this.state.wordType}&factTypes=${this.state.factType1}&factTypes=${this.state.factType2}&factTypes=${this.state.factType3}&factTypes=${this.state.factType4}`;
    fetch(fetchUrl, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(json => this.setState({ nuggetList: json }))
      .catch(ex => console.log('json parsing failed', ex));
    event.preventDefault();
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <QueryInput handleChange={this.updateQueryInput} handleSubmit={this.fetchCustomQuery} />
            <br />
            <NuggetList nuggetResults={this.state.nuggetList} />
          </Col>
        </Row>
      </Grid>
    );
  }
}
