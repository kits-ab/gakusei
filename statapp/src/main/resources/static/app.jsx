var React = require('react');
var client = require('./client');

var App = React.createClass({
  getInitialState: function() {
    return { events: [] };
  },
  componentDidMount: function() {
    client({ method: 'GET', path: '/events' }).done(response => {
      this.setState({ events: response.entity._embedded.events });
    });
  },
  render: function() {
    return <EventsList events={this.state.events} />;
  }
});
