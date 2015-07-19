import React from 'react';
import { RouteHandler } from 'react-router';

export default React.createClass({

  getInitialState() {
    return {};
  },

  render() {

    var title = this.props.title;

    return (
      <div className="app-container">
        <h1>{title}</h1>
        <div className="container">
          <RouteHandler />
        </div>
      </div>
    );
  }
});
